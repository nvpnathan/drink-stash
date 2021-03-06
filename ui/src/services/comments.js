import { RecipeStub } from './recipes';
import { BaseService } from './base';

export class Comment {
    constructor(payload) {
        this.id = payload.id;
        this.user = payload.user;
        this.recipe = new RecipeStub(payload.recipe);
        this.rating = payload.rating;
        this.text = payload.text;
        this.updated = payload.updated;
        this.created = payload.created;
    }

    toPayload() {
        return {
            id: this.id,
            recipe: this.recipe.id,
            rating: this.rating,
            text: this.text
        }
    }
}

export class CommentService extends BaseService {
    baseUrl = '/api/v1/comments/';
    model = Comment;
}
