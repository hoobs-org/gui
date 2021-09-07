gui: clean lint paths metadata deploy
	dpkg-deb --build dist
	cp dist.deb builds/hoobs-gui-$(shell project version)-hoobs-all.deb
	dpkg-sig --sign builder builds/hoobs-gui-$(shell project version)-hoobs-all.deb
	rm -f dist.deb
	rm -fR dist

lint:
	./node_modules/.bin/vue-cli-service lint

paths:
	mkdir -p builds
	mkdir -p dist
	mkdir -p dist/DEBIAN
	mkdir -p dist/usr
	mkdir -p dist/usr/lib

metadata:
	cat control | \
	sed "s/__VERSION__/$(shell project version)/" | \
	sed "s/__DEPENDS__/hoobsd (>= 4.0.0), helm (>= 1.2.2)/" | \
	sed "s/__ARCH__/all/" > dist/DEBIAN/control

deploy:
	./node_modules/.bin/vue-cli-service build --modern
	cp LICENSE dist/usr/lib/hoobs/
	node -e 'const pjson = require("./package.json"); delete pjson.dependencies; delete pjson.devDependencies; delete pjson.engines; require("fs").writeFileSync("dist/usr/lib/hoobs/package.json", JSON.stringify(pjson, null, 4));'

clean:
	rm -fR dist
