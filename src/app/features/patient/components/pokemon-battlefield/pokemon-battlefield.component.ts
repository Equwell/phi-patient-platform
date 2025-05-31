import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import type { Patient } from '~features/patient/types/patient.type';
import { PokemonImageComponent } from '~features/patient/components/pokemon-image/pokemon-image.component';
import { NgOptimizedImage } from '@angular/common';
import { CatchAnimationComponent } from '~features/patient/components/catch-animation/catch-animation.component';

@Component({
  selector: 'app-pokemon-battlefield',
  templateUrl: './pokemon-battlefield.component.html',
  styleUrl: './pokemon-battlefield.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PokemonImageComponent, CatchAnimationComponent, NgOptimizedImage],
})
export class PokemonBattlefieldComponent {
  readonly pokemon = input<Patient | null>();
  readonly pokemonImage = signal('');
  readonly startCatchAnimation = signal(false);
  readonly pokemonImageLoaded = signal(false);

  startPokemonInitialAnimation(loaded: boolean) {
    this.pokemonImageLoaded.set(loaded);
  }

}
