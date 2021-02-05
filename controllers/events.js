const moment = require("moment");
const {
  findAllEvents,
  findOneEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../models/events");

module.exports.handleAllEvents = async (req, res) => {
  const datas = await findAllEvents(req);
  const allEventsLength = await findAllEvents();
  res.set("X-Total-Count", allEventsLength.length);
  res.send(
    datas.map(
      ({
        id,
        date,
        title,
        price,
        availabilities,
        description,
        moderator_id,
        duration_seconds,
        main_picture_url,
        address_id,
        street,
        zipcode,
        city,
        firstname,
        lastname,
        email,
        phone_number,
        bio,
        role,
        photo_url,
        website_url,
        facebook_url,
        twitter_url,
        instagram_url,
        name,
        vigneron,
        cepage,
        arome,
        sommelier,
        image: wine_image,
        website,
        specificities,
        producteur,
      }) => ({
        id,
        date,
        title,
        price,
        availabilities,
        description,
        moderator_id,
        duration_seconds,
        main_picture_url,
        address_id,
        street,
        zipcode,
        city,
        firstname,
        lastname,
        email,
        phone_number,
        bio,
        role,
        photo_url,
        website_url,
        facebook_url,
        twitter_url,
        instagram_url,
        name,
        vigneron,
        cepage,
        arome,
        sommelier,
        wine_image,
        website,
        specificities,
        producteur,
      })
    )
  );
};

module.exports.handleAnEvent = async (req, res) => {
  res.send(await findOneEvent(req.params.id));
};

module.exports.handleCreateEvent = async (req, res) => {
  const image = req.file ? req.file.path : null;
  const {
    date,
    title,
    price,
    description,
    moderator_id,
    duration_seconds,
    address_id,
    wine_id,
  } = req.body;
  const createdUserId = await createEvent({
    date: moment(date).format("YYYY-MM-DD"),
    title,
    price,
    description,
    moderator_id,
    duration_seconds,
    main_picture_url: image,
    address_id,
    wine_id,
  });
  return res.status(201).json(createdUserId);
};

module.exports.handleUpdateEvent = async (req, res) => {
  const {
    main_picture_url,
    date,
    title,
    price,
    description,
    moderator_id,
    duration_seconds,
    address_id,
    wine_id,
    availabilities,
  } = req.body;
  const image = req.file ? req.file.path : main_picture_url;
  const attributes = {
    date: moment(date).format("YYYY-MM-DD"),
    title,
    price,
    description,
    moderator_id,
    duration_seconds,
    main_picture_url: image,
    address_id,
    wine_id,
    availabilities,
  };
  const data = await updateEvent(req.params.id, attributes);
  res.send(data);
};

module.exports.handleDeleteEvent = async (req, res) => {
  await deleteEvent(req.params.id);
  return res.sendStatus(204);
};
