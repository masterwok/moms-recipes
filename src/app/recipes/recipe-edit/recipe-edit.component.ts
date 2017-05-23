import {AfterContentInit, Component, OnInit} from '@angular/core';
import {ActionButtonsService} from '../../services/action-buttons.service';
import {ActionButton} from '../../action-buttons/models/action-button.model';
import {Location} from '@angular/common';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Recipe} from '../models/recipe.model';
import {RecipeService} from '../../services/recipe.service';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Ingredient} from '../models/ingredient.model';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, AfterContentInit {
  public imagePath = `http://lorempixel.com/300/200/food/${Math.round(Math.random() * 10)}`;
  public recipeForm: FormGroup;
  public recipe: Recipe;

  get noSteps(): boolean {
    return (<FormArray>this.recipeForm.get('steps')).controls.length === 0;
  }

  get noIngredients(): boolean {
    return (<FormArray>this.recipeForm.get('ingredients')).controls.length === 0;
  }

  get shouldPromptWhenDiscarding(): boolean {
    return this.recipeForm.dirty;
  }

  constructor(private location: Location,
              private route: ActivatedRoute,
              private router: Router,
              private recipeService: RecipeService,
              private actionButtonService: ActionButtonsService) {
  }

  ngOnInit() {

    // Need to initialize material box as this content is loaded dynamically
    window['jQuery']('.materialboxed').materialbox();

    this.recipeForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      imagePath: new FormControl(null),
      ingredients: new FormArray([]),
      steps: new FormArray([])
    });

    this.route.params.subscribe((params: Params) => {
      const id = +params['id'];

      this.recipe = this.recipeService.getRecipe(id);

      this.imagePath = this.recipe ? this.recipe.imagePath : this.imagePath;

      this.setFormGroup(this.recipe);
    });

  }

  ngAfterContentInit(): void {
    this.actionButtonService.setActionButtons([
      new ActionButton(
        'undo',
        'red waves-effect waves-light',
        'Discard',
        () => this.location.back()
      ),
      new ActionButton(
        'save',
        'cyan waves-effect waves-light',
        'Save',
        () => this.onSubmit()
      )
    ]);

  }

  onSubmit() {
    const value = this.recipeForm.value;

    console.log(`Form is valid ? ${this.recipeForm.valid}`);

    const recipe = new Recipe(
      value.id,
      value.name,
      value.description,
      value.imagePath,
      [],
      []
    );


    value.ingredients.map(ingredient => {
      recipe.ingredients.push(new Ingredient(
        ingredient.ingredientName,
        ingredient.ingredientAmount)
      );
    });

    value.steps.map(control => recipe.steps.push(control.step));

    if (recipe.id) {
      this.recipeService.updateRecipe(recipe);
      this.router.navigate(['/recipes', recipe.id]);
    } else {
      this.recipeService.createRecipe(recipe);
      this.router.navigate(['/recipes']);
    }

  }

  private setFormGroup(recipe?: Recipe) {
    if (!recipe) {
      return;
    }

    this.recipeForm.reset({
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      imagePath: recipe.imagePath,
      ingredients: new FormArray([])
    });

    recipe.ingredients.forEach(i => {
      this.addIngredient(this.createIngredientFormGroup(i));
    });

    recipe.steps.forEach(s => {
      this.addStep(this.createStepFormGroup(s));
    });
  }

  private createStepFormGroup(step?: string): FormGroup {
    return new FormGroup({
      'step': new FormControl(
        step ? step : null,
        [Validators.required]
      )
    });
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
      )
    });
  }

  addStep(step: FormGroup) {
    const formArray = <FormArray>this.recipeForm.get('steps');
    formArray.push(step ? step : this.createStepFormGroup());
  }

  removeStep(control: FormControl) {
    const formArray = (<FormArray>this.recipeForm.get('steps'));
    const controlIndex = formArray.controls.indexOf(control);

    formArray.removeAt(controlIndex);
  }

  addIngredient(ingredient: FormGroup) {
    const formArray = <FormArray>this.recipeForm.get('ingredients');
    formArray.push(ingredient ? ingredient : this.createIngredientFormGroup());
  }

  removeIngredient(control: FormControl) {
    const formArray = (<FormArray>this.recipeForm.get('ingredients'));
    const controlIndex = formArray.controls.indexOf(control);

    formArray.removeAt(controlIndex);
  }

}