import React, { memo } from 'react';
import Heading from '../../../atoms/Heading/Heading';
import LinkBtn from '../../../atoms/LinkButton/LinkBtn';
import { useTranslation } from "react-i18next";
import styles from './styles.module.css';
import ItemCardLists from './ItemCardLists';

const RankedItems = memo(({ items, className, ...props }) => {

  const { t } = useTranslation();

  return (
    <div className={className} {...props}>
      <Heading tag={"h2"} tag_style={"h1"} className={styles.heade_line}>
        {t("user.top.ranking")}
      </Heading>
      <ItemCardLists items={items} />
      <LinkBtn to={"/items/rank"} color="link" className={styles.view_all_btn}>
        {t("user.top.view-all")}
      </LinkBtn>
    </div>
  );
});

export default RankedItems;