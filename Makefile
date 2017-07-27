dev:
	jekyll serve --incremental --future --limit_posts 30 --watch

minify_css:
	./node_modules/.bin/uglifycss _includes/styles.css > _includes/styles_min.css

