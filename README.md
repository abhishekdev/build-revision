# build-revision

[![Build Status](https://travis-ci.org/abhishekdev/build-revision.svg?branch=master)](https://travis-ci.org/abhishekdev/build-revision)
[![Coverage Status](https://coveralls.io/repos/github/abhishekdev/build-revision/badge.svg)](https://coveralls.io/github/abhishekdev/build-revision)

Generate a semver compatible version number for your continuous builds which includes [build metadata](http://semver.org/#spec-item-10)

## Usage

### Install

```sh
$ npm install --save-dev build-revision
```

### Example

#### ES5

```javascript
var buildRevision = require('build-revision');

buildRevision().then(function(version){
  console.log(version);
});
```

#### ES7

```javascript
import buildRevision from 'build-revision';

const fn = aync() => {
  const version = await buildRevision();
  console.log(version);
}
```

## API

### buildRevision(options)

- Appends `prefix.githash` to the version for a repo with no local changes

  * 0.1.0 => 0.1.0+SHA.01234567
  * 0.1.0-pre => 0.1.0-pre+SHA.01234567
  * 0.1.0-pre+SHA.01234567 => 0.1.0-pre+SHA.01234567

- Appends `prefix.githash.username.timestamp` to the version for repo with local changes

  * 0.1.0 => 0.1.0+SHA.01234567.currentuser.20170101T000000Z
  * 0.1.0-pre => 0.1.0+SHA.01234567.currentuser.20170101T000000Z
  * 0.1.0-pre+SHA.01234567 => 0.1.0+SHA.01234567.currentuser.20170101T000000Z

- The timestamp is a ISO 8601 UTC string

```
Type: Promise
Throws: Error
  - if the package version is not resolved
  - if the package version is not a valid semver
  - if the project is not a git repository
Returns:
  - semver compatible version with a build metadata part
```

### Options

#### options.prefix

Build metadata Prefix

```
Type: `String`
Default: `SHA`
```

#### options.cwd

Search for the closest package.json starting from this directory

```
Type: `String`
Default: `.`
```

## License [MIT](LICENSE)
