import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertService } from '../../services/alerts';
import { Recipe, RecipeService } from '../../services/recipes';
import { Comment, CommentService } from '../../services/comments';
import { List, ListService, ListRecipe, ListRecipeService } from '../../services/lists';
import { units } from '../../constants';
import { User, UserService } from '../../services/users';
import { faHeart, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';


@Component({
    selector: 'recipe-detail-view',
    templateUrl: './index.html',
    styleUrls: ['./style.css']
})
export class RecipeDetailViewComponent {
    constructor(
        private alertService: AlertService,
        private recipeService: RecipeService,
        private commentService: CommentService,
        private listService: ListService,
        private listRecipeService: ListRecipeService,
        private userService: UserService,
    ) {}

    @Input() recipe: Recipe;
    @Output() output: EventEmitter<Recipe> = new EventEmitter<Recipe>();

    showQuantities: any[] = [];
    units = units;
    faHeart = faHeart;
    faCheckSquare = faCheckSquare;
    faSquare = faSquare;

    editingTags: boolean = false;
    updatedTags: string[];
    canEdit: boolean;
    user: User;
    comments: Comment[];
    showModal: boolean = false;
    lists: List[];
    listRecipes: ListRecipe[];
    canComment: boolean = false;
    commentText: string = '';

    ngOnChanges() {
        this.showQuantities = this.recipe.quantities.filter(q => !q.hidden);
        this.comments = null;
        this.canComment = false;
        this.editingTags = false;
        this.commentText = '';

        this.userService.getSelf().then((user) => {
            this.user = user;
            this.canEdit = user.is_staff || this.recipe.added_by.id === user.id;

            // Fill in related data
            this.getComments();
            this.getLists();
            // this.getListRecipes();
        });
    }

    /*
     * Lazy content loaders
     */

    getComments(): void {
        if (this.recipe.comment_count === 0) {
            this.canComment = true;
            this.comments = [];
        }

        this.commentService.getPage({recipe: `${this.recipe.id}`}).then((resp) => {
            this.canComment = !resp.results.filter((c) => {
                c.user.id === this.user.id
            }).length;
            this.comments = resp.results;
        });
    }

    getLists(): void {
        Promise.all([
            this.listService.getPage({user: this.user.id}),
            this.listRecipeService.getPage({
                user_list__user: this.user.id,
                recipe: this.recipe.id
            })
        ]).then(([listResp, listRecipeResp]) => {
            this.lists = listResp.results;
            this.listRecipes = listRecipeResp.results;
            this.lists.forEach((l) => {
                const count = this.listRecipes.filter((lr) => lr.list === l.id).length;
                l.added_to_recipe = Boolean(count);
            });
        });
    }

    /*
     * Open and close the tags editor
     */

    updateTags(tags: string[]) {
        this.updatedTags = tags;
    }

    cancelTags() {
        this.editingTags = false;
        this.updatedTags = null;
    }

    /*
     * Manage the lists dropdown
     */

    toggleDrop(ev) {
        ev.stopPropagation();
        this.showModal = !this.showModal;
    }

    closeDrop() {
        this.showModal = false;
    }

    /*
     * Save data to the API and refresh the recipe in any outer view listeners
     */

    addedToList(list: List): boolean {
        return list.added_to_recipe;
    }

    addToList(ev, list: List) {
        ev.stopPropagation();
        let lr = this.listRecipes.filter((lr) => lr.list === list.id)[0];
        if (lr) {
            list.added_to_recipe = false;
            this.listRecipes = this.listRecipes.filter((lr) => lr.list !== list.id);
            this.listRecipeService.remove(lr);
            return;
        }

        list.added_to_recipe = true;
        lr = new ListRecipe({
            user_list: list.id,
            recipe: this.recipe
        });
        this.listRecipeService.create(lr).then((saved) => {
            this.listRecipes.push(saved);
        });
    }

    saveTags() {
        this.editingTags = false;
        this.recipe.tags = this.updatedTags;
        this.recipeService.update(this.recipe).then(() => {
            this.output.emit(this.recipe);
        });
    }

    addComment(): void {
        this.canComment = false;
        const payload = new Comment({
            text: this.commentText,
            recipe: {id: this.recipe.id}
        });
        this.commentService.create(payload)
            .then((res: Comment) => {
                this.comments = this.comments.concat([res]);
                this.recipe.comment_count = this.comments.length;
                this.output.emit(this.recipe);
            })
            .catch(() => {
                this.alertService.error('There was an error posting your comment. ' +
                                        'Please try again later.');
            });
    }
}
