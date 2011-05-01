
all: doc

tests:
	vows tests/*

docs = $(shell find doc -name '*.ronn' \
	|sed 's|.ronn|.1|g' \
	|sed 's|doc/|man1/|g' )


man1/%.1: doc/%.ronn
	@[ -x ./node_modules/.bin/ronn ] || npm bundle install ronn
	./node_modules/.bin/ronn --roff $< > $@

doc: $(docs)

.PHONY: doc tests
