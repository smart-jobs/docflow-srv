'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // 发文接口
  router.post('/draft/create', controller.draft.create);
  router.post('/draft/update', controller.draft.update);
  router.post('/draft/post', controller.draft.post);
  router.get('/draft/query', controller.draft.query);
  router.get('/draft/fetch', controller.draft.fetch);
  router.post('/outbox/remind', controller.outbox.update);
  router.post('/outbox/finish', controller.outbox.post);
  router.get('/outbox/query', controller.outbox.query);
  router.get('/outbox/fetch', controller.outbox.fetch);

  // 收文接口
  router.post('/inbox/feedback', controller.inbox.feedback);
  router.get('/inbox/query', controller.inbox.query);
  router.get('/inbox/fetch', controller.inbox.fetch);

};
