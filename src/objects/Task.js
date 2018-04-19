import uuid from 'uuid/v4'
export default class Task {
    constructor(title, description, created, due, deleted, completed, id) {

        if(typeof title == 'object') {
            var data = {
                title: title.title,
                description: title.description,
                created: title.created,
                due: title.due,
                deleted: title.deleted,
                copmleted: title.completed,
                id: title.id
            }
        }else {
            var data = {
                title: title,
                description: description,
                created: created,
                due: due,
                deleted: deleted,
                copmleted: completed,
                id: id
            }
        }
        
        if(typeof data.title == "undefined" || data.title == "") {
            this.title = "";
        }else {
            this.title = data.title;
        }
        
        if(typeof data.description == "undefined" || data.description == "") {
            this.description = "";
        }else {
            this.description = data.description;
        }
        
        if(typeof data.created == "undefined" || data.created == null) {
            this.created = new Date().getTime();
        }else {
            this.created = data.created;
        }
        
        if(typeof data.due == "undefined" || data.due == null) {
            this.due = null;
        }else {
            this.due = data.due;
        }
        
        if(typeof data.deleted == "undefined" || data.deleted == null) {
            this.deleted = null;
        }else {
            this.deleted = data.deleted;
        }
        
        if(typeof data.completed == "undefined" || data.completed == null) {
            this.completed = null;
        }else {
            this.completed = data.completed;
        }
        
        if(typeof data.id == "undefined" || data.id == null) {
            this.id = uuid();
        }else {
            this.id = data.id;
        }
    }
}