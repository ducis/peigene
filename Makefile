SHELL := bash
TIDY = tidy -i -utf8 -w 0 --tidy-mark n --merge-divs n --merge-spans n --drop-empty-paras n --drop-empty-elements n
STD=htg<$< | $(TIDY) | grep -v '^$$'> $@ 
all:paged.js test.html
test.html:test.htg *.htg
	###
	$(STD)
.always:
