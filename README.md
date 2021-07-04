<img src="cubing.js.jpg" width="100%">

# `cubing.js`

![make test](https://github.com/cubing/cubing.js/workflows/make%20test/badge.svg)  
![make build](https://github.com/cubing/cubing.js/workflows/make%20build/badge.svg)

`cubing.js` is a collection of Javascript libraries, still under development.

## Documentation

Documentation is at [`js.cubing.net/cubing/`](https://js.cubing.net/cubing).  
The source for the documentation site is currently inside the [`docs`](./docs/) folder of this repository.

## Development

Development relies on [`node`](https://nodejs.org/en/) and [`npm`](https://docs.npmjs.com/getting-started). Once you have installed those, you can run:

```shell
git clone https://github.com/cubing/cubing.js && cd cubing.js
npm install
make dev
```

This should open [the `experiments` root file](/Users/lgarron/Code/git/github.com/cubing/cubing.js/src/experiments/static/index.html) at http://localhost:3333/ automatically. Any source code changes will refresh the browser.

The core library code for `cubing.js` is in [`src/cubing`](./src/cubing/) To test changes, use:

```shell
make test
```

## License

This project is licensed under the GPL license (version 3 or later). This means that this library is **free to use**, although you **must publish any code that uses it** (e.g. also put it on GitHub). See [the full license](./LICENSE.md) for exact details.

We've selected this license in order to encourage the cubing community to work on software in a way so that everyone can contribute and extend each other's work.
