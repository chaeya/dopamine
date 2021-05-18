import { Injectable } from '@angular/core';
import { Logger } from '../../../core/logger';
import { BaseSettings } from '../../../core/settings/base-settings';
import { StringCompare } from '../../../core/string-compare';
import { FolderModel } from '../../../services/folder/folder-model';
import { SubfolderModel } from '../../../services/folder/subfolder-model';

@Injectable({
    providedIn: 'root',
})
export class FoldersPersister {
    private openedFolderPath: string;
    private openedSubfolderPath: string;

    constructor(private settings: BaseSettings, private logger: Logger) {
        this.initializeFromSettings();
    }

    public getOpenedFolder(availableFolders: FolderModel[]): FolderModel {
        if (availableFolders == undefined) {
            return undefined;
        }

        if (availableFolders.length === 0) {
            return undefined;
        }

        if (StringCompare.isNullOrWhiteSpace(this.openedFolderPath)) {
            return undefined;
        }

        try {
            if (availableFolders.map((x) => x.path).includes(this.openedFolderPath)) {
                return availableFolders.filter((x) => x.path === this.openedFolderPath)[0];
            }
        } catch (e) {
            this.logger.error(`Could not get opened folder. Error: ${e.message}`, 'FoldersPersister', 'getOpenedFolder');
        }

        return undefined;
    }

    public setOpenedFolder(openedFolder: FolderModel): void {
        try {
            if (openedFolder == undefined) {
                this.saveOpenedFolder('');
                this.saveOpenedSubfolder('');
            } else {
                this.saveOpenedFolder(openedFolder.path);
            }
        } catch (e) {
            this.logger.error(`Could not set opened folder. Error: ${e.message}`, 'FoldersPersister', 'setOpenedFolder');
        }
    }

    public getOpenedSubfolder(): SubfolderModel {
        if (StringCompare.isNullOrWhiteSpace(this.openedFolderPath)) {
            return undefined;
        }

        if (StringCompare.isNullOrWhiteSpace(this.openedSubfolderPath)) {
            return undefined;
        }

        try {
            if (this.openedSubfolderPath.includes(this.openedFolderPath)) {
                return new SubfolderModel(this.openedSubfolderPath, false);
            }
        } catch (e) {
            this.logger.error(`Could not get opened subfolder. Error: ${e.message}`, 'FoldersPersister', 'getOpenedSubfolder');
        }

        return undefined;
    }

    public setOpenedSubfolder(openedSubfolder: SubfolderModel): void {
        try {
            if (openedSubfolder == undefined) {
                this.saveOpenedSubfolder('');
            } else {
                this.saveOpenedSubfolder(openedSubfolder.path);
            }
        } catch (e) {
            this.logger.error(`Could not set opened subfolder. Error: ${e.message}`, 'FoldersPersister', 'setOpenedSubfolder');
        }
    }

    private initializeFromSettings(): void {
        this.openedFolderPath = this.settings.foldersTabOpenedFolder;
        this.openedSubfolderPath = this.settings.foldersTabOpenedSubfolder;
    }

    private saveOpenedFolder(openedFolderPath: string): void {
        this.openedFolderPath = openedFolderPath;
        this.settings.foldersTabOpenedFolder = openedFolderPath;
    }

    private saveOpenedSubfolder(openedSubfolderPath: string): void {
        this.openedSubfolderPath = openedSubfolderPath;
        this.settings.foldersTabOpenedSubfolder = openedSubfolderPath;
    }
}
