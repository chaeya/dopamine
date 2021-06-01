import { Injectable } from '@angular/core';
import { FileFormats } from '../../core/base/file-formats';
import { FileSystem } from '../../core/io/file-system';
import { StringCompare } from '../../core/string-compare';
import { Track } from '../../data/entities/track';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';
import { TrackFiller } from '../indexing/track-filler';
import { BaseTrackService } from './base-track.service';
import { TrackModel } from './track-model';
import { TrackModels } from './track-models';

@Injectable()
export class TrackService implements BaseTrackService {
    constructor(private trackRepository: BaseTrackRepository, private fileSystem: FileSystem, private trackFiller: TrackFiller) {}

    public async getTracksInSubfolderAsync(subfolderPath: string): Promise<TrackModels> {
        if (StringCompare.isNullOrWhiteSpace(subfolderPath)) {
            return new TrackModels();
        }

        const subfolderPathExists: boolean = this.fileSystem.pathExists(subfolderPath);

        if (!subfolderPathExists) {
            return new TrackModels();
        }

        const filesInDirectory: string[] = await this.fileSystem.getFilesInDirectoryAsync(subfolderPath);

        const trackModels: TrackModels = new TrackModels();

        for (const file of filesInDirectory) {
            const fileExtension: string = this.fileSystem.getFileExtension(file);
            const fileExtensionIsSupported: boolean = FileFormats.supportedAudioExtensions
                .map((x) => x.toLowerCase())
                .includes(fileExtension.toLowerCase());

            if (fileExtensionIsSupported) {
                const track: Track = new Track(file);
                const filledTrack: Track = await this.trackFiller.addFileMetadataToTrackAsync(track);
                const trackModel: TrackModel = new TrackModel(filledTrack);
                trackModels.addTrack(trackModel);
            }
        }

        return trackModels;
    }

    public getAllTracks(): TrackModels {
        const tracks: Track[] = this.trackRepository.getTracks();
        const trackModels: TrackModels = new TrackModels();

        for (const track of tracks) {
            const trackModel: TrackModel = new TrackModel(track);
            trackModels.addTrack(trackModel);
        }

        return trackModels;
    }
}
