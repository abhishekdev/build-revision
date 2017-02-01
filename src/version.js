'use strict';

import path from 'path';
import moment from 'moment';
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
    if (data && data.pkg && data.pkg.version) {
        return data.pkg.version;
    }
    throw new TypeError('Could not read a valid version from: ' + data.path
        ? path.relative('', data.path)
        : 'package.json');
};

// Help identify dirty builds, those that differ from the latest commit.
// If the working directory is dirty, append the username and date to
// the version string, to make it stand out.
const suffix = async(version, option) => {
    const startMarker = '+';
    const fieldSeparator = '.';
    const prefix = version.includes(startMarker)
        ? fieldSeparator
        : startMarker;
    const dirty = await repo.isDirty(option);
    const hash = await repo.hash(option);
    let buildmeta = [
        option.prefix || 'SHA',
        hash
    ];

    if (dirty) {
        const name = await username();
        buildmeta.push(semverString(name));
        buildmeta.push(semverMoment());
    }

    // Attach or append to "build data", as defined by semver.
    return version + prefix + buildmeta.join(fieldSeparator);
};

const getRevision = async(cwd) => {
    const version = await pkgVersion({cwd});
    const revision = await suffix(version, {cwd});

    return revision;
};

const version = async(o) => {
    const option = Object.assign({}, o);
    const cwd = path.resolve(option.cwd || '');
    const revision = await getRevision(cwd);

    return revision;
};

export default version;
