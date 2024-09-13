ALTER TABLE Subscription
DROP
FOREIGN KEY FK58mb61f6r5nnf12sxle20v9yp;

ALTER TABLE my_restaurant_list
DROP
FOREIGN KEY FK804hyp9mx69tm6a7gevqlupwk;

ALTER TABLE MyRestaurantList
DROP
FOREIGN KEY FK89mpj8p8m9ryn0knnkator52i;

ALTER TABLE restaurant_category
DROP
FOREIGN KEY FKbb0u1d5pjsybkykbvosf5ndfi;

ALTER TABLE Review
DROP
FOREIGN KEY FKcdp5omjy4bnqx0vggr7u12d9x;

ALTER TABLE restaurant
DROP
FOREIGN KEY FKdsa1att8o1yhd88n6hn6b2dqj;

ALTER TABLE my_restaurant_list
DROP
FOREIGN KEY FKdvt7jyjw90iamivb9cvlwjori;

ALTER TABLE Review_img
DROP
FOREIGN KEY FKfaod3ig2nrwitfg20uyy9icm7;

ALTER TABLE user_restaurant_category_mapping
DROP
FOREIGN KEY FKfofn8s878vjl3vymd5mug3b88;

ALTER TABLE user_restaurant_category_mapping
DROP
FOREIGN KEY FKo7ug13ymg41j919r91q5ks2pr;

ALTER TABLE Subscription
DROP
FOREIGN KEY FKqykxs6q5hkea00lvgif5e1b41;

ALTER TABLE MyRestaurantList
DROP
FOREIGN KEY FKsdp1cpjpgbachn0husa7jiuse;

ALTER TABLE m_user
    ADD user_role VARCHAR(255) NULL;

ALTER TABLE restaurant
    ADD CONSTRAINT FK_RESTAURANT_ON_CATEGORY FOREIGN KEY (category_id) REFERENCES restaurant_category (category_id);

DROP TABLE MyRestaurantList;

DROP TABLE RestaurantCategory;

DROP TABLE Review;

DROP TABLE Review_img;

DROP TABLE Subscription;

DROP TABLE my_restaurant_list;

DROP TABLE tb_user;

DROP TABLE user_restaurant_category_mapping;

ALTER TABLE M_USER
DROP
COLUMN `role`;

ALTER TABLE restaurant_category
DROP
COLUMN user_index;

ALTER TABLE restaurant_category
    MODIFY category_name VARCHAR (255) NULL;

ALTER TABLE restaurant
    MODIFY name VARCHAR (255) NULL;

ALTER TABLE m_user
    MODIFY nickname VARCHAR (255) NULL;