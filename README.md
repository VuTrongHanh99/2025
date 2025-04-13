"# 2025" 
# remove specific file from git cache
git rm --cached filename

# remove all files from git cache
git rm -r --cached .
git add .
git commit -m ".gitignore is now working"
------------------------------------------------------------------
Tạo nhánh master và chuyển default về nhánh master
Cách viết Gitignore Pattern hiệu quả
------------------------------------------------------------------
{**}/
{sub}/
------------------------------------------------------------------
{name.type}				====>ignore file có name và type chỉ định.
*.{type}				====>ignore file có name và type chỉ định.
{name}.*				====>ignore file có name và type chỉ định.
{name}*.{type}			====>ignore file có name và type chỉ định.
============
Dấu ? đại diện cho 1 ký tự bất kỳ.
[09] đại diện cho 1 ký tự bất kỳ từ 0 --> 9.
[az] đại diện cho 1 ký tự bất kỳ từ a --> z.
------------------------------------------------------------------
Dấu (!) dùng để cho phép commit các case đặc biệt nếu trước đó đã bị ignore.

=======> Ví dụ
*.log               # ignore tất cả file *.log
!important.log      # cho phép commit pattern important.log

debug[09].log       # ignore debug0.log, debug1.log,..., debug9.log
debug[!13].log      # cho phép commit pattern debug1.log, debug2.log, debug3.log.
debug2.log          # ignore 2 (pattern khai báo sau có độ ưu tiên cao hơn)
                    # => KẾT QUẢ CUỐI: sẽ ignore 0,2,4,5,...9
node_modules/
build/
