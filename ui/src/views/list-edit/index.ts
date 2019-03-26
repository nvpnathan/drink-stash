import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertService } from '../../services/alerts';
import { AuthService } from '../../services/auth';
import { Recipe, RecipeService } from '../../services/recipes';
import { List, ListService, ListRecipe, ListRecipeService } from '../../services/lists';

const err = 'There was an error saving your list.  Please try again later.';

@Component({
    selector: 'list-edit',
    templateUrl: './index.html'
})
export class ListEditComponent implements OnInit {
    constructor(
        private alertService: AlertService,
        private authService: AuthService,
        private listService: ListService,
        private listRecipeService: ListRecipeService,
        private recipeService: RecipeService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    list: List;
    recipes: Recipe[] = [];
    user_id: number;
    loading: boolean = true;

    ngOnInit() {
        this.user_id = this.authService.getUserData().user_id;
        const id = this.route.snapshot.params.id,
              recipeIds = this.route.snapshot.queryParams.recipes;

        if (id) {
            this.getExisting(id);
        } else {
            this.getNew(recipeIds);
        }
    }

    getExisting(id) {
        this.listService.getById(id).then((list) => {
            this.loading = false;
            if (list.user.id !== this.user_id) {
                return this.router.navigateByUrl(`/users/${this.user_id}`);
            }
            this.list = list
        }, () => this.alertService.error());
    }

    getNew(recipeIds: string) {
        if (recipeIds) {
            this.recipeService.getPage({id__in: recipeIds})
                .then((resp) => this.recipes = resp.results);
        }
        this.list = new List({name: '', description: ''});
        this.loading = false;
    }

    delete(): void {
        this.loading = true;
        this.listService.remove(this.list)
            .then(() => this.router.navigateByUrl(`/users/${this.user_id}`))
            .catch(() => this.alertService.error());
    }

    update() {
        this.loading = true;
        this.listService.update(this.list).then(() => {
            this.router.navigateByUrl(`/lists/${this.list.id}`);
        });
    }

    create() {
        this.loading = true;
        this.listService.create(this.list).then((saved) => {
            Promise.all(this.recipes.map((r) => {
                return this.listRecipeService.create(new ListRecipe({
                    user_list: saved.id,
                    recipe: {id: r.id}
                }));
            }))
            .then(
                () => this.router.navigateByUrl(`/lists/${saved.id}`),
                () => this.alertService.error(err)
            );
        });
    }
}
