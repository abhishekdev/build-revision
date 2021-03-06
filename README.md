# build-revision

[![Coverage Status](https://coveralls.io/repos/github/abhishekdev/build-revision/badge.svg)](https://coveralls.io/github/abhishekdev/build-revision)
[![Build status](https://ci.appveyor.com/api/projects/status/87rwahlhtj1903ag?svg=true)](https://ci.appveyor.com/project/abhishekdev/build-revision)
[![Build Status](https://travis-ci.org/abhishekdev/build-revision.svg)](https://travis-ci.org/abhishekdev/build-revision)

Generate semver compatible version to uniquely identify project build using [build metadata](http://semver.org/#spec-item-10)

## Usage

### Install

```sh
# OPTION: Use npm
$ npm install --save-dev build-revision

# OPTION: Use yarn
$ yarn add build-revision --dev
```

### Example

#### ES2015

```javascript
var buildRevision = require('build-revision');

buildRevision().then(function(version){
  console.log(version);
});
```

#### ES2017+

```javascript
import buildRevision from 'build-revision';

const fn = aync() => {
  const version = await buildRevision();
  console.log(version);
}
```

## Results

> If build metadata included in 'package.json' differs from that found by git. The SHA found by git is used.

### Working copy has no changes (_CI/CD Tools_)

Version                | Build Version
:--------------------- | :---------------------
0.1.0                  | 0.1.0+SHA.abcd123
0.1.0-pre              | 0.1.0-pre+SHA.abcd123
0.1.0-pre+SHA.01234567 | 0.1.0-pre+SHA.01234567

### Working copy has no changes (_Developer Machine_)

Version                | Build Version
:--------------------- | :--------------------------------------------------
0.1.0                  | 0.1.0+SHA.abcd123.currentuser.20170101T000000Z
0.1.0-pre              | 0.1.0-pre+SHA.abcd123.currentuser.20170101T000000Z
0.1.0-pre+SHA.01234567 | 0.1.0-pre+SHA.01234567.currentuser.20170101T000000Z

### Working copy is _NOT_ a git clone

Version   | Build Version
:-------- | :-------------------------------------------
0.1.0     | 0.1.0+NOREV.currentuser.20170101T000000Z
0.1.0-pre | 0.1.0-pre+NOREV.currentuser.20170101T000000Z

## API

### buildRevision(options)

- Appends `prefix.username.timestamp` to the version if repository does not exists
- Appends `prefix.githash.username.timestamp` to the version for a git repository with local changes
- Appends `prefix.githash` to the version for a git repository with no local changes

> The timestamp is an ISO 8601 UTC string

```yml
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

```yml
Type: `String`
Default: `SHA`
```

#### options.cwd

Search for the closest package.json starting from this directory

```yml
Type: `String`
Default: `.`
```

## License [MIT](LICENSE)
