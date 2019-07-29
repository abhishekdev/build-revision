'use strict';

import path from 'path';
import moment from 'moment';
import semver from 'semver';
import username from 'username';
import readPkgUp from 'read-pkg-up';
import repo from './repo';

const REGEX_NOT_APLHA_NUMERIC = /\W/g;
const REGEX_ISODATE_MILLISECONDS = /\.[0]{3}/g;

// Replace demarcators in a string, so that it is compatible as a semver fragment
const semverString = (str) => {
    return str.replace(REGEX_NOT_APLHA_NUMERIC, '');
};

// Generate an ISO 8601 UTC timestamp that is safe for use in a semver string
// NOTE: The generated date should be ISO 8601 compatible.
// e.g. 2017-Jan-01, 15:00:01.100 => "20170130T1500Z"
const semverMoment = () => {
    // Get ISO date after ignoring the millisecond precision
    const isoDate = moment().milliseconds(0).toISOString();

    // Replace millisecond information as the 'dot' notation for it is incompatible with semver
    return semverString(isoDate.replace(REGEX_ISODATE_MILLISECONDS, ''));
};

// Read version key from the nearest package
const pkgVersion = async(o) => {
    const data = await readPkgUp({cwd: o.cwd});
    if (data && data.package && data.package.version) {
        return semver.valid(data.package.version);
    }
    throw new TypeError('Could not read a valid version from: ' + data.path
        ? path.relative('', data.path)
        : 'package.json');
};

// Identify dirty builds, those that differ from the latest commit.
const buildmeta = async(version, option) => {
    const metaMarker = '+';
    const metaSeparator = '.';
    const prefix = version.includes(metaMarker)
        ? metaSeparator
        : metaMarker;
    const repoExists = await repo.exists(option);

    let buildmeta = [option.prefix || 'NOREV'];
    let dirty = true;
    let hash;

    if (repoExists) {
        dirty = await repo.isDirty(option);
        hash = await repo.hash(option);
        buildmeta = [
            option.prefix || 'SHA',
            hash
        ];
    }

    // If the working directory is dirty or not a valid repository,
    // append the current username and current timestamp to the version
    if (dirty) {
        const name = await username();
        buildmeta.push(semverString(name));
        buildmeta.push(semverMoment());
    }

    // Append the semver compatible buildmeta to version
    return version + prefix + buildmeta.join(metaSeparator);
};

const getRevision = async(option) => {
    const version = await pkgVersion(option);
    const revision = await buildmeta(version, option);

    return revision;
};

const version = async(o) => {
    const option = Object.assign({}, o);
    const cwd = path.resolve(option.cwd || '');

    return await getRevision(option);
};

export default version;
