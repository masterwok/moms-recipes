import {AfterContentInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Recipe} from '../models/recipe.model';
import {RecipeService} from '../../services/recipe.service';
import {$} from 'jquery';
import {ActionButton} from '../../action-buttons/models/action-button.model';
import {ActionButtonsService} from '../../services/action-buttons.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, AfterContentInit {
  public recipe: Recipe;
  private removeRecipeModal;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private recipeService: RecipeService,
              private actionButtonSerivce: ActionButtonsService) {
  }

  ngOnInit() {

    // Need to initialize material box as this content is loaded dynamically
    window['jQuery']('.materialboxed').materialbox();

    this.route.params.subscribe((params) => {
      this.recipe = this.recipeService.getRecipe(+params.id);
    });
  }

  ngAfterContentInit(): void {
    this.removeRecipeModal = window['jQuery']('#removeRecipeModal');

    // Need to initialize modals
    this.removeRecipeModal.modal({
      dismissible: false
    });

    this.actionButtonSerivce.setActionButtons([
      new ActionButton(
        'add',
        'green waves-effect waves-light',
        'Create',
        () => this.router.navigate(['edit'], {
          relativeTo: this.route.parent
        })
      ),
      new ActionButton(
        'edit',
        'cyan waves-effect waves-light',
        'Edit',
        () => {
          this.router.navigate(['edit'], {
            relativeTo: this.route
          });
        }
      ),
      new ActionButton(
        'delete',
        'red waves-effect waves-light',
        'Remove',
        () => this.showRemoveRecipeModal()),
    ]);
  }

  private showRemoveRecipeModal() {
    this.removeRecipeModal.modal('open');
  }

  removeRecipe() {
    this.recipeService.removeRecipe(this.recipe.id);
    this.router.navigate(['/recipes']);
  }


}
