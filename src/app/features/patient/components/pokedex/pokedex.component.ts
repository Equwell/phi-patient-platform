import type { OnInit, WritableSignal } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import type { Patient } from '~features/patient/types/patient.type';
import { PokemonImageComponent } from '~features/patient/components/pokemon-image/pokemon-image.component';
import { FirstTitleCasePipe } from '~core/pipes/first-title-case.pipe';
import { UserService } from '~features/authentication/services/user.service';
import type { User } from '~features/authentication/types/user.type';
import { BattleEvent } from '~features/patient/components/pokedex/enums/pokedex-action.enum';
import { AlertService } from '~core/services/ui/alert.service';
import { translations } from '../../../../../locale/translations';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss', './pokedex-pads.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [PokemonImageComponent, FirstTitleCasePipe],
})
export class PokedexComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);

  readonly pokemonBattleEvent = input.required<WritableSignal<BattleEvent>>();
  readonly patient = input<Patient | null>();
  user: User | null = null;
  updatedUser: User | null = null;
  readonly isPokedexClosed = signal(true);
  readonly pokemonImage = signal('');
  readonly userHasCaught = signal(false);
  readonly userHasPokemon = signal(true);
  readonly isPokedexButtonDisabled = signal(false);

  translations = translations;

  constructor() {
    effect(() => {
      this.updatePokemonState();
      this.handleBattleEvents();
    });
  }

  ngOnInit() {
    const pokemonValue = this.patient();
    if (pokemonValue) {
      this.userService
        .getMe()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (user: User) => {
            this.user = user;
            
            this.userHasPokemon.set(user.caughtPokemonIds.includes(pokemonValue.id));
            setTimeout(() => {
              this.isPokedexClosed.set(false);
            }, 300);
          },
          error: () => {
            this.alertService.createErrorAlert(translations.genericErrorAlert);
          },
        });
    }
  }

  togglePokedex() {
    this.isPokedexClosed.set(!this.isPokedexClosed());
  }

  notifyBattlefield() {
    this.isPokedexButtonDisabled.set(true);
    (this.pokemonBattleEvent() as unknown as WritableSignal<BattleEvent>).set(
      BattleEvent.THROW_POKEBALL,
    );
  }

  catchPokemon() {
    this.userHasCaught.set(false);
    const pokemonId = this.patient()?.id;
    if (pokemonId) {
      this.userService
        .catchPokemon({ pokemonId })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (user) => {
            this.notifyBattlefield();
            this.updatedUser = user;
          },
        });
    }
  }

  private updatePokemonState(): void {
    if (this.patient()) {
      // Add logic to update Pokemon state
    }
  }

  private handleBattleEvents(): void {
    const event = this.pokemonBattleEvent()();
    switch (event as unknown as BattleEvent) {
      case BattleEvent.CATCH_ANIMATION_ENDED: {
        this.handleCatchAnimationEnded();
        break;
      }
      case BattleEvent.RESET_BATTLE: {
        this.handleResetBattle();
        break;
      }
      default: {
        break;
      }
    }
  }

  private handleCatchAnimationEnded(): void {
    if (this.updatedUser) {
      this.user = this.updatedUser;
      this.userHasCaught.set(true);
    }
  }

  private handleResetBattle(): void {
    this.userHasCaught.set(false);
    this.isPokedexButtonDisabled.set(false);
    const pokemonValue = this.patient();
    const pokemonId = pokemonValue?.id;
    const caughtPokemonIds = this.user?.caughtPokemonIds ?? [];
    this.userHasPokemon.set(pokemonId ? caughtPokemonIds.includes(pokemonId) : true);
  }
}
