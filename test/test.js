import fs from 'fs';
import test from 'ava';
import semver from 'semver';
import moment from 'moment';

import buildRevision from '../index';

test('build revision is semver compatible', async t => {
    const option = {
        cwd: 'test/fixture/package-valid/target'
    };

    const revision = await buildRevision(option);
    t.truthy(semver.valid(revision), 'semver could not parse a valid version');
});

test('throws error for package with missing version', async t => {
    const option = {
        cwd: 'test/fixture/package-invalid/target'
    };

    return buildRevision(option).then((res) => {
        t.fail('invalid package did not throw error');
    }, (err) => {
        t.truthy(err instanceof TypeError, err.message);
    });
});

test('buildinfo prefix is configurable', async t => {
    const PREFIX = 'REV';
    const option = {
        prefix: PREFIX,
        cwd: 'test/fixture/package-valid/target'
    };

    const revision = await buildRevision(option);
    t.truthy(semver.valid(revision) && revision.includes('+' + PREFIX), 'configured buildinfo prefix not set');
});

test('updates the existing buildinfo fragment of semver', async t => {
    const option = {
        cwd: 'test/fixture/package-with-buildinfo/target'
    };
    const fixtureVersion = require('./fixture/package-with-buildinfo/package.json').version;

    t.true((fixtureVersion.match(/\+/g) || []).length === 1, 'test fixture does not include buildinfo')
    const revision = await buildRevision(option);
    t.true(semver.valid(revision) && (revision.match(/\+/g) || []).length === 1, 'invalid version with multiple buildfragments generated');
});

test('generates ISO 8601 UTC timestamp for dirty builds', async t => {
    const option = {
        cwd: 'test/fixture/package-valid/target'
    };

    // Test Setup: Emulate a dirty repository by adding a file to the fixtures directory
    fs.writeFileSync('test/fixture/package-valid/change.txt', 'dummychange');

    const revision = await buildRevision(option);
    const timestamp = revision.split('.').pop();
    t.true(moment(timestamp).isValid(), 'could not parse a valid timestamp');

    // Test Teardown: Reset repository
    fs.unlink('test/fixture/package-valid/change.txt', (err) => {
        if (err) {
            t.fail('Could not reset test setup, other tests might be affected')
            throw err;
        }
    });
});

test.todo('throws error when project is not a git clone');
test.todo('throws error when no SHA is found (e.g. localbuilds before initial git commit)');
