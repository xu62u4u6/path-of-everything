-- Minimal compatibility module used by stock PoB headless runs on systems
-- where lua-utf8 is not installed for the selected LuaJIT executable.
-- These are the operations PoB currently needs during deterministic CLI runs.
local M = {}

M.gsub = string.gsub
M.find = string.find
M.sub = string.sub
M.reverse = string.reverse
M.match = string.match

function M.next(s, i, dir)
	if type(s) ~= "string" then
		return nil
	end
	i = tonumber(i) or 1
	dir = tonumber(dir) or 1
	if dir >= 0 then
		local j = i + 1
		if j > #s + 1 then
			return #s + 1
		end
		return j
	end
	local j = i - 1
	if j < 0 then
		return 0
	end
	return j
end

return M
