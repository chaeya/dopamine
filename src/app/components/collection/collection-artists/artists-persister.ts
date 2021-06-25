import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Logger } from '../../../common/logger';
import { BaseSettings } from '../../../common/settings/base-settings';
import { Strings } from '../../../common/strings';
import { ArtistOrder } from './artist-order';

@Injectable()
export class ArtistsPersister {
    private selectedArtistNames: string[] = [];
    private selectedArtistOrder: ArtistOrder;
    private selectedArtistsChanged: Subject<string[]> = new Subject();

    constructor(public settings: BaseSettings, public logger: Logger) {
        this.initializeFromSettings();
    }

    public selectedArtistsChanged$: Observable<string[]> = this.selectedArtistsChanged.asObservable();

    public getSelectedArtists(availableArtists: ArtistModel[]): ArtistModel[] {
        if (availableArtists == undefined) {
            return [];
        }

        if (availableArtists.length === 0) {
            return [];
        }

        try {
            return availableArtists.filter((x) => this.selectedArtistNames.includes(x.name));
        } catch (e) {
            this.logger.error(`Could not get selected artists. Error: ${e.message}`, 'ArtistsPersister', 'getSelectedArtists');
        }

        return [];
    }

    public setSelectedArtists(selectedArtists: ArtistModel[]): void {
        try {
            if (selectedArtists != undefined && selectedArtists.length > 0) {
                this.selectedArtistNames = selectedArtists.map((x) => x.name);
            } else {
                this.selectedArtistNames = [];
            }

            if (this.selectedArtistNames.length > 0) {
                this.saveSelectedArtistToSettings(this.selectedArtistNames[0]);
            } else {
                this.saveSelectedArtistToSettings('');
            }

            this.selectedArtistsChanged.next(this.selectedArtistNames);
        } catch (e) {
            this.logger.error(`Could not set selected artists. Error: ${e.message}`, 'ArtistsPersister', 'setSelectedArtists');
        }
    }

    public getSelectedArtistOrder(): ArtistOrder {
        if (this.selectedArtistOrder == undefined) {
            return ArtistOrder.byArtistAscending;
        }

        return this.selectedArtistOrder;
    }

    public setSelectedArtistOrder(selectedArtistOrder: ArtistOrder): void {
        try {
            this.selectedArtistOrder = selectedArtistOrder;
            this.saveSelectedArtistOrderToSettings(ArtistOrder[selectedArtistOrder]);
        } catch (e) {
            this.logger.error(`Could not set selected artist order. Error: ${e.message}`, 'ArtistsPersister', 'setSelectedArtistOrder');
        }
    }

    private initializeFromSettings(): void {
        if (!Strings.isNullOrWhiteSpace(this.getSelectedArtistOrderFromSettings())) {
            this.selectedArtistOrder = (ArtistOrder as any)[this.getSelectedArtistOrderFromSettings()];
        }
    }

    public getSelectedArtistFromSettings(): string {
        return this.settings.artistsTabSelectedArtist;
    }

    public saveSelectedArtistToSettings(selectedArtist: string): void {
        this.settings.artistsTabSelectedArtist = selectedArtist;
    }

    private getSelectedArtistOrderFromSettings(): string {
        return this.settings.artistsTabSelectedArtistOrder;
    }

    private saveSelectedArtistOrderToSettings(selectedArtistOrderName: string): void {
        this.settings.artistsTabSelectedArtistOrder = selectedArtistOrderName;
    }
}