import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonBattlefieldComponent } from '~features/patient/components/pokemon-battlefield/pokemon-battlefield.component';
import { PokedexComponent } from '~features/patient/components/pokedex/pokedex.component';
import { BattleEvent } from '~features/patient/components/pokedex/enums/pokedex-action.enum';
import { translations } from '../../../../../locale/translations';
import { AlertService } from '~core/services/ui/alert.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PatientService } from '~features/patient/services/patient.service';
import type { Pokemon } from '~features/patient/types/pokemon.type';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [PokemonBattlefieldComponent, PokedexComponent],
})
export class PokemonDetailComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly pokemonService = inject(PatientService);
  private readonly alertService = inject(AlertService);

  readonly pokemonId = toSignal(
    this.activatedRoute.paramMap.pipe(map((parameters) => parameters.get('pokemonId') ?? '')),
    { initialValue: '' },
  );
  readonly pokemonResource = this.pokemonService.getPatientResource(this.pokemonId);
  readonly pokemon = signal<Pokemon | null>(null);

  // eslint-disable-next-line @angular-eslint/prefer-signals
  pokemonBattleEvent = signal(BattleEvent.POKEMON_LOADED);

  constructor() {
    effect(() => {
      if (this.pokemonResource.value()) {
        this.pokemonBattleEvent.set(BattleEvent.RESET_BATTLE);
      }
      if (this.pokemonResource.error()) {
        this.alertService.createErrorAlert(translations.pokemonNotFoundError);
      }
    });
  }
}
