import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Ingredient} from '../../models/ingredient.model';
import {Recipe} from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-ingredients-list',
  templateUrl: './recipe-ingredients-list.component.html',
  styleUrls: ['./recipe-ingredients-list.component.css']
})
export class RecipeIngredientsListComponent implements OnInit, OnChanges {
  @Input() recipeFormGroup: FormGroup;
  @Input() recipe: Recipe;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.recipe || !this.recipe.ingredients) {
      return;
    }

    this.recipe.ingredients.forEach(i => {
      this.addIngredient(this.createIngredientFormGroup(i));
    });
  }

  get noIngredients(): boolean {
    return (<FormArray>this.recipeFormGroup.get('ingredients')).controls.length === 0;
  }

  addIngredient(ingredient: FormGroup) {
    const formArray = <FormArray>this.recipeFormGroup.get('ingredients');
    formArray.push(ingredient ? ingredient : this.createIngredientFormGroup());

    if (!ingredient) {
      this.recipeFormGroup.markAsDirty();
    }
  }

  removeIngredient(control: FormControl) {
    const formArray = (<FormArray>this.recipeFormGroup.get('ingredients'));
    const controlIndex = formArray.controls.indexOf(control);

    formArray.removeAt(controlIndex);

    this.recipeFormGroup.markAsDirty();
  }

  private createIngredientFormGroup(ingredient?: Ingredient): FormGroup {
    return new FormGroup({
      'ingredientName': new FormControl(
        ingredient ? ingredient.name : null,
        [Validators.required]
      ),
      'ingredientAmount': new FormControl(
        ingredient ? ingredient.amount : null,
        [Validators.required]
      ),
      'ingredientNote': new FormControl(
        ingredient ? ingredient.note : null
      )
    });
  }
}
