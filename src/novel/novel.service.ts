import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from 'src/category/entities/category.entity';
import { createUniqName, donwloadFileFromURL } from 'src/helpers/ultils';
import { Tag } from 'src/tag/entities/tag.entity';
import { getRepository, In } from 'typeorm';
import { Chapter } from '../chapter/entities/chapter.entity';
import {NotificationType, Status} from '../helpers/enum';
import { CreateNovelDto } from './dto/create-novel.dto';
import { FindNovelAdvDto } from './dto/find-novel-adv.dto';
import { FindNovelDto } from './dto/find-novel.dto';
import { UpdateNovelDto } from './dto/update-novel.dto';
import { Novel } from './entities/novel.entity';
import {BookmarkDto} from "../users/dtos/bookmark.dto";
import {User} from "../users/user.entity";
import {InAppNotification} from "../in-app-notification/entities/in-app-notification.entity";
import {val} from "cheerio/lib/api/attributes";
import {ChapterService} from "../chapter/chapter.service";
const cheerio = require('cheerio'); // khai báo module cheerio
const fs = require('fs');
const request = require('request-promise'); // khai báo module request-promise
const puppeteer = require('puppeteer');
@Injectable()
export class NovelService {
  browser;
  constructor(private readonly chapterService: ChapterService) {
    this.init();
  }
  async findAll(body: FindNovelDto) {
    const novels = getRepository(Novel)
      .createQueryBuilder('novel')
      .leftJoinAndSelect('novel.categories', 'category')
      .leftJoinAndSelect('novel.tags', 'tag')
      .select(['novel', 'category.id', 'category.name', 'tag.id', 'tag.name', 'tag.uniqueName'])
      .orderBy('novel.updatedAt', 'DESC');

    if (body.name) {
      novels.andWhere('novel.name LIKE :name', { name: `%${body.name}%` });
    }
    if (body.uniqueName) {
      novels.andWhere('novel.uniqueName LIKE :uniqueName', { uniqueName: `%${body.uniqueName}%` });
    }
    if (body.author) {
      novels.andWhere('novel.author =:author', { author: body.author });
    }
    if (body.status) {
      novels.andWhere('novel.status =:status', { status: body.status });
    }
    if (body.categoryId) {
      novels.andWhere('category.id =:id', { id: body.categoryId });
    }
    if (body.tagUniqueName) {
      novels.andWhere('tag.uniqueName LIKE :uniqueName', { uniqueName: `%${body.tagUniqueName}%` });
    }

    if (body.tagId) {
      novels.andWhere('tag.id =:id', { id: body.tagId });
    }

    if (body.orderByView) {
      novels.orderBy('novel.views', 'DESC');
    }

    if (body.orderByLastUpdate) {
      novels.orderBy('chapters.updatedAt', 'DESC');
    }

    if (body.limit !== undefined && body.limit !== null) {
      novels.take(body.limit);
    }

    if (body.skip !== undefined && body.skip !== null && body.skip) {
      novels.skip(body.skip);
    }

    const data = await novels.getManyAndCount();
    return data;
  }

  findOne(id: number) {
    return getRepository(Novel)
      .createQueryBuilder('novel')
      .leftJoinAndSelect('novel.chapters', 'chapter')
      .select(['novel','chapter.id', 'chapter.name'])
      .andWhere('novel.id =:id', { id: id }).getOne();
  }

  async getByRanking() {
    const mostRead = await getRepository(Novel).find({
      skip: 0,
      take: 10,
      order: {
        views: 'DESC',
      },
    });
    const newTrends = await getRepository(Novel).find({
      skip: 0,
      take: 10,
    });
    const userRate = await getRepository(Novel).find({
      skip: 0,
      take: 10,
    });

    const data = {
      mostRead,
      newTrends,
      userRate,
    };
    return data;
  }
  async weeklyMostActive() {
    return getRepository(Novel).find({
      skip: 0,
      take: 10,
    });
  }
  async searchAdvance(body: FindNovelAdvDto) {
    const novels = getRepository(Novel)
      .createQueryBuilder('novel')
      .leftJoinAndSelect('novel.chapters', 'chapters')
      .leftJoinAndSelect('novel.categories', 'category')
      .leftJoinAndSelect('novel.tags', 'tag')
      .select(['novel', 'chapters', 'category.id', 'category.name', 'tag.id', 'tag.name', 'tag.uniqueName'])
      .orderBy('novel.updatedAt', 'DESC');

    if (body.categoryIds && body.categoryIds.length > 0) {
      const array = body.categoryIds;
      if (body.categoryCondition == 'OR') {
        novels.orWhere('category.id IN(:...id)', { id: body.categoryIds });
      }
      if (body.categoryCondition == 'AND') {
        novels.andWhere('category.id IN(:...id)', { id: body.categoryIds });
      }
    }
    if (body.tagIds && body.tagIds.length > 0) {
      if (body.tagCondition == 'OR') {
        novels.orWhere('tag.id IN(:...id)', { id: body.tagIds });
      }
      if (body.tagCondition == 'AND') {
        novels.andWhere('tag.id IN(:...id)', { id: body.tagIds });
      }
    }
    if (body.limit !== undefined && body.limit !== null) {
      novels.take(body.limit);
    }

    if (body.skip !== undefined && body.skip !== null && body.skip) {
      novels.skip(body.skip);
    }

    return novels.getManyAndCount();
  }
  async update(id: number, updateNovelDto: UpdateNovelDto) {
    const existNovel = await getRepository(Novel).findOne(id);
    if (!existNovel) {
      throw new NotFoundException();
    }
    const update = Object.assign({}, existNovel, updateNovelDto);
    return getRepository(Novel).save(update);
  }
  async create(data: CreateNovelDto) {
    let categories;
    let tags;
    if (data.categories) {
      categories = await getRepository(Category).find({ where: { name: In(data.categories) } });
      if (categories.length == 0) {
        const createCategories = [];
        data.categories.forEach((it) => {
          createCategories.push({
            name: it,
            uniqueName: createUniqName(it),
          });
        });
        categories = await getRepository(Category).save(createCategories);
      }
    }
    if (data.tags) {
      tags = await getRepository(Tag).find({
        where: {
          name: In(data.tags),
        },
      });
      if (tags.length == 0) {
        const createTags = [];
        data.tags.forEach((it) => {
          createTags.push({
            name: it,
            uniqueName: createUniqName(it),
          });
        });
        tags = await getRepository(Tag).save(createTags);
      }
    }
    const novel = Object.assign(
      {},
      data,
      {
        status: Status.Ongoing,
        views: 0,
        bookmarked: 0,
        rank: 0,
      },
      {
        categories: categories,
      },
      {
        tags: tags,
      },
    );
    return getRepository(Novel).save(novel);
  }

  async createNovelBySource() {
    // const filePath = join(__dirname, "..", "uploads/defaults", "source-8c02e6da-298a-4585-9e5e-8acb9d27736b.csv");
    let data = require('fs').readFileSync('test.csv', 'utf8');
    const donwloadImagePath = process.env.IMAGE_PATH;
    data = data.split('\r\n');
    for (const value of data) {
      if (value !== '') {
        request(value, (error, response, html) => {
          console.log(html, 'html'); // 200, kiểm tra xem kết nối thành công không :D
          fs.writeFileSync('data2.html', html);
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html); // load HTML
            const cate = [];
            const tags = [];
            const title = $('.post-title > h1').text();
            const image = $('.summary_image > a > img').attr('src');
            const imageName = new Date().getTime();
            const pathImage = donwloadFileFromURL(image, donwloadImagePath, `${imageName.toString()}.jpg`);
            const des = $('#editdescription > p').text();
            const author = $('.author-content > a').text();
            $('.genres-content > a').each((index, el) => {
              const text = $(el).text();
              cate.push(text);
            });
            $('.tags-content > a').each((index, el) => {
              const text = $(el).text();
              tags.push(text);
            });

            console.log(123);
            const myNovel: CreateNovelDto = {
              name: title.trim(),
              uniqueName: createUniqName(title.trim()),
              description: des,
              sourceLink: value,
              categories: cate,
              tags: tags,
              image: `${imageName.toString()}.jpg`,
            };
            this.create(myNovel);
          }
        });
      }
      // fs.writeFileSync('data.html', $.html);
    }
  }

  async crawlNovels() {
    const allNovel = await this.findAll({});
    for (let novel of allNovel[0]) {
      if (novel.sourceLink && novel.sourceLink.startsWith('https://novelfull.com/')) {
        this.openPage(novel.sourceLink)
          .then(async (body) => {
            // fs.writeFileSync('data.html', body);
            const $ = cheerio.load(body);
            const urls = [];
            if (novel.sourceLink.startsWith('https://novelfull.com/')) {
              let ul = $('.list-chapter > li').each(async (index, el) => {
                let link = `https://novelfull.com${$(el).find('a').attr('href')}`;
                let nameChapter = $(el).find('a').text();
                const att = link.split('/');
                const name = [];
                att.forEach((value) => {
                  if (value !== '') {
                    name.push(value.replace('.html', ''));
                  }
                });
                const currentChapter = await this.chapterService.findAll({novelUniqueName: novel.uniqueName});
                const current = novel.chapters.find((value) => value.uniqueName === name[name.length - 1]);
                if (!current) {
                  urls.push({url: link, name: nameChapter, uniqueName: name[name.length - 1]});
                }
              })
            } else {
              $('.wp-manga-chapter').each((index, el) => {
                let link = $(el).find('a').attr('href');
                let nameChapter = $(el).find('a').text();
                const att = link.split('/');
                const name = [];
                att.forEach((value) => {
                  if (value !== '') {
                    name.push(value);
                  }
                });
                const current = novel.chapters.find((value) => value.uniqueName === name[name.length - 1]);
                if (!current) {
                  urls.push({ url: link, name: nameChapter, uniqueName: name[name.length - 1] });
                }
              });
            }
            //  this.getChapter(urls[0], novel);
            for (let url of urls.reverse()) {
              await this.getChapter(url, novel);
            }
          })
          .catch((e) => {
            Error(e);
          });
      }
    }
  }

  async openPage(value, className?) {
    return new Promise(async (resolve, reject) => {
      // const browser = await puppeteer.launch({
      //   headless: true,
      //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
      // });
      if (!this.browser) {
        this.init();
      }
      else {
        this.browser.newPage().then(async (page) => {
          try {
            await page.goto(value);
            if (className) {
              await page.waitForSelector(`.${className}`, { timeout: 2000 });
            }
            const body = await page.evaluate(() => {
              return document.querySelector('body').innerHTML;
            });
            await page.close();
            resolve(body);
          } catch (e) {
            reject(e);
          }
        })
            .catch(e => {
              console.log(e);
            });
      }
    });
  }

  async getChapter(value, novel) {
    try {
      const chapter = await this.openPage(value.url);
      const new$ = cheerio.load(chapter);
      const content = new$('.cha-words').html();
      let datapase = '';
      new$(content).each((index, el) => {
        let p = new$(el).find('p').html();
        let html = '<p>';
        if (p) {
          html += `${p.toString()}</p>`;
          datapase += html;
        }
      });
      const fileName = `${new Date().getTime().toString()}.txt`;
      const filePath = fileName;
      fs.writeFileSync(filePath, datapase);
      const uniqueName = value.uniqueName.split('-');
      const ep = uniqueName[uniqueName.indexOf('chapter') + 1];
      const chapterDto = {
        name: value.name,
        uniqueName: value.uniqueName,
        description: null,
        content: fileName,
        novel: novel,
        episode: ep || 0
      };
      const chapte1r = await getRepository(Chapter).save(chapterDto);
      const userBookmark: any[] = await this.getUserBookmark(novel.id);
      const req = [];
      userBookmark[0].forEach(user => {
        const notificationDto = {
          "title": `${novel.name} has a new chapter`,
          "message": `${novel.name} has a new chapter ${value.name}`,
          "type": NotificationType.NewChapter,
          "isRead": false,
          "user": {
            "id": user.id
          }
        }
        req.push(getRepository(InAppNotification).save(notificationDto));
      })
      Promise.all(req);
      console.log(chapte1r);
    } catch (e) {
      Error(e);
    }
  }

  init() {
    puppeteer
      .launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })
      .then((value) => {
        this.browser = value;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async getUserBookmark(novelId: any) {
    if (!novelId) {
      throw new NotFoundException('Thiếu novelId');
    }
    const currentNovelData = await this.findOne(novelId);

    if (currentNovelData) {
        const coursesQuery = getRepository(User)
            .createQueryBuilder('user')
            .select('user.id')
            .orderBy('user.updatedAt', 'DESC')
            .andWhere('user.bookmark LIKE :novelId', { novelId: `%${novelId}%` })
        const courses = await coursesQuery.getManyAndCount();
        return courses;
      }
      return [[], 0];
  }
}
