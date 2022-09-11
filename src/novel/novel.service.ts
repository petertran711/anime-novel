import {Injectable, NotFoundException} from '@nestjs/common';
import {Category} from 'src/category/entities/category.entity';
import {createUniqName, donwloadFileFromURL} from 'src/helpers/ultils';
import {Tag} from 'src/tag/entities/tag.entity';
import {getRepository, In} from 'typeorm';
import {Chapter} from '../chapter/entities/chapter.entity';
import {NotificationType, Status} from '../helpers/enum';
import {CreateNovelDto} from './dto/create-novel.dto';
import {FindNovelAdvDto} from './dto/find-novel-adv.dto';
import {FindNovelDto} from './dto/find-novel.dto';
import {UpdateNovelDto} from './dto/update-novel.dto';
import {Novel} from './entities/novel.entity';
import {BookmarkDto} from "../users/dtos/bookmark.dto";
import {User} from "../users/user.entity";
import {InAppNotification} from "../in-app-notification/entities/in-app-notification.entity";
import {val} from "cheerio/lib/api/attributes";
import {ChapterService} from "../chapter/chapter.service";
import {GlobalService} from "../helpers/Storage";

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
        .leftJoinAndSelect('novel.chapters', 'chapter')
        .select(['novel', 'chapter.uniqueName', 'category.id', 'category.name', 'tag.id', 'tag.name', 'tag.uniqueName'])
        .orderBy('novel.updatedAt', 'DESC');

    if (body.name) {
      novels.andWhere('novel.name LIKE :name', {name: `%${body.name}%`});
    }
    if (body.uniqueName) {
      novels.andWhere('novel.uniqueName LIKE :uniqueName', {uniqueName: `%${body.uniqueName}%`});
    }
    if (body.author) {
      novels.andWhere('novel.author =:author', {author: body.author});
    }
    if (body.status) {
      novels.andWhere('novel.status =:status', {status: body.status});
    }
    if (body.categoryId) {
      novels.andWhere('category.id =:id', {id: body.categoryId});
    }
    if (body.tagUniqueName) {
      novels.andWhere('tag.uniqueName LIKE :uniqueName', {uniqueName: `%${body.tagUniqueName}%`});
    }

    if (body.tagId) {
      novels.andWhere('tag.id =:id', {id: body.tagId});
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
        .select(['novel', 'chapter.id', 'chapter.name'])
        .andWhere('novel.id =:id', {id: id}).getOne();
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
        .select(['novel', 'chapters.uniqueName', 'category.id', 'category.name', 'tag.id', 'tag.name', 'tag.uniqueName'])
        .orderBy('novel.updatedAt', 'DESC');

    if (body.categoryIds && body.categoryIds.length > 0) {
      const array = body.categoryIds;
      if (body.categoryCondition == 'OR') {
        novels.orWhere('category.id IN(:...id)', {id: body.categoryIds});
      }
      if (body.categoryCondition == 'AND') {
        novels.andWhere('category.id IN(:...id)', {id: body.categoryIds});
      }
    }
    if (body.tagIds && body.tagIds.length > 0) {
      if (body.tagCondition == 'OR') {
        novels.orWhere('tag.id IN(:...id)', {id: body.tagIds});
      }
      if (body.tagCondition == 'AND') {
        novels.andWhere('tag.id IN(:...id)', {id: body.tagIds});
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
      categories = await getRepository(Category).find({where: {name: In(data.categories)}});
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
    novel.sourceLink = '';
    const newNovel = await getRepository(Novel).save(novel);
    const chapters = []
    await this.crawlWithNew(data.sourceLink, newNovel, chapters);
    for (const chapter of chapters) {
      const crawling = GlobalService.globalVar.find(value => value.link === chapter.url);
      if (!crawling) {
        GlobalService.globalVar.push({link: chapter.url})
        this.getChapter({
          url: chapter.url,
          name: chapter.name,
          uniqueName: chapter.uniqueName
        }, chapter.novel, chapter.className);
        const idx = chapters.indexOf(chapter);
        if (idx === chapters.length - 1) {
          newNovel.sourceLink = data.sourceLink;
          const updateNovel = await getRepository(Novel).update(newNovel.id, {sourceLink: data.sourceLink});
          console.log(updateNovel);
        }
      }
    }
    return newNovel;
  }

  async createNovelBySource() {
    // const filePath = join(__dirname, "..", "uploads/defaults", "source-8c02e6da-298a-4585-9e5e-8acb9d27736b.csv");
    let data = require('fs').readFileSync('test.csv', 'utf8');
    const donwloadImagePath = process.env.IMAGE_PATH;
    data = data.split('\r\n');
    for (const value of data) {
      if (value !== '') {
        request(value, (error, response, html) => {
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
      if (novel.sourceLink && novel.sourceLink !== '') {
        this.openPage(novel.sourceLink)
            .then(async (body) => {
              // fs.writeFileSync('data.html', body);
              try {
                const $ = cheerio.load(body);
                const chapters = [];
                if (novel.sourceLink.startsWith('https://novelfull.com/')) {
                  $('.l-chapters > li').each(async (index, el) => {
                    let link = `https://novelfull.com${$(el).find('a').attr('href')}`;
                    let nameChapter = $(el).find('a').text();
                    const att = link.split('/');
                    const name = [];
                    att.forEach((value) => {
                      if (value !== '') {
                        name.push(value.replace('.html', ''));
                      }
                    });
                    chapters.push({
                      name: nameChapter,
                      uniqueName: name[name.length - 1],
                      url: link,
                      novel: novel,
                      className: '.chapter-content'
                    })
                  })
                } else {
                  $('.wp-manga-chapter').each(async (index, el) => {
                    let link = $(el).find('a').attr('href');
                    let nameChapter = $(el).find('a').text();
                    const att = link.split('/');
                    const name = [];
                    att.forEach((value) => {
                      if (value !== '') {
                        name.push(value);
                      }
                    });
                    chapters.push({
                      name: nameChapter,
                      uniqueName: name[name.length - 1],
                      url: link,
                      novel: novel,
                      className: '.text-left'
                    })
                  });
                }
                for (const chapter of chapters) {
                  const currentChapter = chapter.novel.chapters.find(value => value.uniqueName === chapter.uniqueName);
                  const crawling = GlobalService.globalVar.find(value => value.link === chapter.url);
                  if (!currentChapter && !crawling) {
                    GlobalService.globalVar.push({link: chapter.url})
                    await this.getChapter({
                      url: chapter.url,
                      name: chapter.name,
                      uniqueName: chapter.uniqueName
                    }, chapter.novel, chapter.className);
                  }
                }
              } catch (e) {
                console.log(e);
              }
            })
            .catch((e) => {
              Error(e);
            });
      }
    }
  }

  async crawlWithNew(link, novel, chapters) {
    try {
      const body = await this.openPage(link)
      // fs.writeFileSync('data.html', body);
      const $ = cheerio.load(body);
      if (link.startsWith('https://novelfull.com/')) {
        $('.list-chapter > li').each(async (index, el) => {
          let link = `https://novelfull.com${$(el).find('a').attr('href')}`;
          let nameChapter = $(el).find('a').text();
          const att = link.split('/');
          const name = [];
          att.forEach((value) => {
            if (value !== '') {
              name.push(value.replace('.html', ''));
            }
          });
          chapters.push({
            name: nameChapter,
            uniqueName: name[name.length - 1],
            url: link,
            novel: novel,
            className: '.chapter-content'
          })
        })
      } else {
        $('.wp-manga-chapter').each(async (index, el) => {
          let link = $(el).find('a').attr('href');
          let nameChapter = $(el).find('a').text();
          const att = link.split('/');
          const name = [];
          att.forEach((value) => {
            if (value !== '') {
              name.push(value);
            }
          });
          chapters.push({
            name: nameChapter,
            uniqueName: name[name.length - 1],
            url: link,
            novel: novel,
            className: '.text-left'
          })
        });
      }
      const nextEl = $('.next').find('a').attr('href');
      if (nextEl) {
        let link = `https://novelfull.com${nextEl}`;
        await this.crawlWithNew(link, novel, chapters);
      }
    } catch (e) {
      console.log(e);
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
      } else {
        this.browser.newPage().then(async (page) => {
          const blocked_domains = [
            'googlesyndication.com',
            'adservice.google.com',
            'google-analytics.com',
            'trends.revcontent.com',
            'assets.revcontent.com',
            'js.ad-score.com',
            'img.revcontent.com',
            'cdn.revcontent.com',
            'yeet.revcontent.com',
            'data.ad-score.com',
            'gum.criteo.com',
            'api.rlcdn.com',
            'id.crwdcntrl.net',
            'mug.criteo.com',
            'services.vlitag.com',
            'assets.vlitag.com',
            'googletagservices.com',
            'imasdk.googleapis.com',
            'securepubads.g.doubleclick.net',
            'cdn.jsdelivr.net',
            'px.vliplatform.com',
            'media.vlitag.com'
          ];

          await page.setRequestInterception(true);
          page.on('request', request => {
            const url = request.url()
            if (blocked_domains.some(domain => url.includes(domain))) {
              request.abort();
            } else {
              request.continue();
            }
          });
          try {
            await page.goto(value, {waitUntil: 'networkidle0', timeout: 0});
            if (className) {
              await page.waitForSelector(`.${className}`, {timeout: 2000});
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

  async getChapter(value, novel, className) {
    try {
      const chapter = await this.openPage(value.url);
      const new$ = cheerio.load(chapter);
      const content = new$(className).html()
      let datapase = '';
      new$(content).each((index, el) => {
        let p = new$(el).text();
        let html = '<p>'
        if (p) {
          html += `${p.toString()}</p>`
          datapase += html;
        }
      })
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
          "user": user
        } as InAppNotification;
        req.push(getRepository(InAppNotification).save(notificationDto));
      })
      await Promise.all(req);
      const deleteFromGlobal = GlobalService.globalVar.find(url => url.link === value.url);
      GlobalService.globalVar.splice(GlobalService.globalVar.indexOf(deleteFromGlobal), 1);
    } catch (e) {
      Error(e);
    }
  }

  init() {
    const minimal_args = [
      '--autoplay-policy=user-gesture-required',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-dev-shm-usage',
      '--disable-domain-reliability',
      '--disable-extensions',
      '--disable-features=AudioServiceOutOfProcess',
      '--disable-hang-monitor',
      '--disable-ipc-flooding-protection',
      '--disable-notifications',
      '--disable-offer-store-unmasked-wallet-cards',
      '--disable-popup-blocking',
      '--disable-print-preview',
      '--disable-prompt-on-repost',
      '--disable-renderer-backgrounding',
      '--disable-setuid-sandbox',
      '--disable-speech-api',
      '--disable-sync',
      '--hide-scrollbars',
      '--ignore-gpu-blacklist',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-first-run',
      '--no-pings',
      '--no-sandbox',
      '--no-zygote',
      '--password-store=basic',
      '--use-gl=swiftshader',
      '--use-mock-keychain',
    ];
    puppeteer
        .launch({
          headless: true,
          args: minimal_args,
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
          .orderBy('user.updatedAt', 'DESC')
          .andWhere('user.bookmark LIKE :novelId', {novelId: `%${novelId}%`})
      const courses = await coursesQuery.getManyAndCount();
      return courses;
    }
    return [[], 0];
  }
}
