'use strict';

import { exec } from 'child_process';

const git = (command, option) => {
    const config = Object.assign({}, option);
    return new Promise((resolve, reject) => {
        exec(
            'git ' + command,
            {
                cwd: config.cwd,
            },
            (err, stdout) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(stdout.trimRight());
            }
        );
    });
};

const git__isDirty = async (option) => {
    const status = await git('status --porcelain', option);
    return status !== '';
};

const git__getHash = async (option) => {
    const hash = await git('rev-parse --short HEAD', option);
    if (hash !== '') {
        return hash;
    }
    throw new Error('Could not find Git SHA');
};

const git__exists = async (option) => {
    let isGit = true;

    try {
        await git('rev-parse', option);
    } catch (e) {
        isGit = false;
    }

    return isGit;
};

export default {
    exists: git__exists,
    isDirty: git__isDirty,
    hash: git__getHash,
};
