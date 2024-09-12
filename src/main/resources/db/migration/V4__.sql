
ALTER TABLE restaurant
    ADD CONSTRAINT FK_RESTAURANT_ON_CATEGORY FOREIGN KEY (category_id) REFERENCES restaurant_category (category_id);

ALTER TABLE restaurant_category
    MODIFY category_name VARCHAR (255) NULL;

ALTER TABLE m_user
DROP
COLUMN `role`;

ALTER TABLE m_user
    ADD `role` VARCHAR(255) NULL;