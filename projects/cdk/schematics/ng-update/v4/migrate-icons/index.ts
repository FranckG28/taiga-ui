import type {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {chain} from '@angular-devkit/schematics';
import {
    FINISH_SYMBOL,
    getPackageJsonDependency,
    infoLog,
    REPLACE_SYMBOL,
    saveActiveProject,
    SMALL_TAB_SYMBOL,
    titleLog,
} from 'ng-morph';

import type {TuiSchema} from '../../../ng-add/schema';
import {getFileSystem} from '../../utils/get-file-system';
import {renameIcons} from './rename-icons';
import {renameProprietaryIcons} from './rename-proprietary-icons';

export function migrateIcons(options: TuiSchema): Rule {
    return chain([
        (tree: Tree, context: SchematicContext) => {
            const fileSystem = getFileSystem(tree);

            !options['skip-logs'] &&
                infoLog(`${SMALL_TAB_SYMBOL}${REPLACE_SYMBOL} replacing icons...`);

            if (hasProprietaryIcons(tree)) {
                renameProprietaryIcons(context);
            } else {
                renameIcons();
            }

            fileSystem.commitEdits();
            saveActiveProject();

            !options['skip-logs'] &&
                titleLog(`${FINISH_SYMBOL} Icons successfully migrated \n`);
        },
    ]);
}

function hasProprietaryIcons(tree: Tree): boolean {
    return (
        !!getPackageJsonDependency(tree, '@taiga-ui/proprietary-icons') ||
        !!getPackageJsonDependency(tree, '@taiga-ui/proprietary')
    );
}
