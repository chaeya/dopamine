import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { IMock, Mock, Times } from 'typemoq';
import { Desktop } from '../../core/io/desktop';
import { BaseSnackBarService } from '../../services/snack-bar/base-snack-bar.service';
import { SnackBarComponent } from './snack-bar.component';

describe('SnackBarComponent', () => {
    let component: SnackBarComponent;
    let fixture: ComponentFixture<SnackBarComponent>;

    let componentWithMocks: SnackBarComponent;
    let snackBarServiceMock: IMock<BaseSnackBarService>;
    let desktopMock: IMock<Desktop>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [SnackBarComponent],
            providers: [BaseSnackBarService, Desktop, { provide: MAT_SNACK_BAR_DATA, useValue: {} }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SnackBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        snackBarServiceMock = Mock.ofType<BaseSnackBarService>();
        desktopMock = Mock.ofType<Desktop>();

        componentWithMocks = new SnackBarComponent(snackBarServiceMock.object, desktopMock.object, {
            icon: 'My icon',
            animateIcon: true,
            message: 'My message',
            showCloseButton: true,
            url: 'My url',
        });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('openDataUrl', () => {
        it('should open data url link', () => {
            // Arrange

            // Act
            componentWithMocks.openDataUrl();

            // Assert
            desktopMock.verify((x) => x.openLink('My url'), Times.exactly(1));
        });
    });

    describe('dismissAsync', () => {
        it('should dismiss snack bar', async () => {
            // Arrange

            // Act
            await componentWithMocks.dismissAsync();

            // Assert
            snackBarServiceMock.verify((x) => x.dismissAsync(), Times.exactly(1));
        });
    });
});