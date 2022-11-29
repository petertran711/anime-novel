import { Injectable } from '@nestjs/common';
import {EventEmitter2, OnEvent} from '@nestjs/event-emitter';
import {Novel} from "../entities/novel.entity";
import {ChapterService} from "../../chapter/chapter.service";
import {NovelService} from "../novel.service";

@Injectable()
export class NovelCreatedListener {

    constructor(private readonly novelService: NovelService) {
    }

    @OnEvent('novel.create')
    handleOrderCreatedEvent(novel: Novel) {
        // handle and process "OrderCreatedEvent" event
        console.log(novel.name, 'message');
        this.novelService.listenToEvent(novel).then(value => console.log(value))
            .catch(e => console.log(e));
    }
}