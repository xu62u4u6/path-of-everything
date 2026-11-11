#!/usr/bin/env python3
"""Offline budget arithmetic. Prices and crafting probabilities are caller evidence."""
import argparse
import json
import math
from datetime import datetime
from pathlib import Path


def number(value, name, positive=False):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError(f'{name}: finite number required')
    if value < 0 or (positive and value == 0):
        raise ValueError(f'{name}: invalid nonpositive/negative value')
    return value


def calculate(plan):
    for field in ('league', 'quoted_at', 'source'):
        if not isinstance(plan.get(field), str) or not plan[field].strip():
            raise ValueError(f'{field}: nonempty string required')
    stamp = datetime.fromisoformat(plan['quoted_at'].replace('Z', '+00:00'))
    if stamp.tzinfo is None:
        raise ValueError('quoted_at: timezone required')
    rate = number(plan['chaos_per_divine'], 'chaos_per_divine', True)
    budget = number(plan['budget_divine'], 'budget_divine')
    total, unknown = 0, []
    for row in plan['items']:
        quantity = number(row['quantity'], 'quantity')
        if row.get('unit_chaos') is None:
            if quantity:
                unknown.append(row['name'])
        else:
            total += quantity * number(row['unit_chaos'], 'unit_chaos')
    result = {
        'league': plan['league'], 'quoted_at': plan['quoted_at'], 'source': plan['source'],
        'known_cost_divine': total / rate, 'unknown_prices': unknown,
        'remaining_after_known_cost_divine': budget - total / rate,
        'status': 'over_budget' if total > budget * rate else ('incomplete_prices' if unknown else 'priced_lines_within_budget'),
        'limitations': 'Offline arithmetic only; no live quote, recipe, completeness, or outcome guarantee.'
    }
    if 'trial' in plan:
        t = plan['trial']
        if not isinstance(t.get('event'), str) or not t['event'].strip():
            raise ValueError('trial.event: explicit success event required')
        p = number(t['success_probability'], 'success_probability', True)
        if p > 1:
            raise ValueError('success_probability: must be <= 1')
        n = t['attempt_cap']
        if isinstance(n, bool) or not isinstance(n, int) or n < 0:
            raise ValueError('attempt_cap: nonnegative integer required')
        result['trial'] = {
            'event': t['event'],
            'assumption': 'Independent trials, unchanged probability and reset state; one stage only.',
            'mean_attempts': 1 / p,
            'p95_attempts': 1 if p == 1 else math.ceil(math.log(.05) / math.log1p(-p)),
            'attempt_cap': n,
            'success_within_cap': (1.0 if n else 0.0) if p == 1 else -math.expm1(n * math.log1p(-p))
        }
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('plan', type=Path)
    args = parser.parse_args()
    try:
        print(json.dumps(calculate(json.loads(args.plan.read_text())), ensure_ascii=False, indent=2))
    except (ValueError, KeyError, TypeError, OSError) as exc:
        parser.exit(2, f'Invalid plan: {exc}\n')
