import React, { useEffect, memo } from 'react';
import { useRecoilState } from 'recoil';
import useCreateParams from '../../../hooks/useCreateParams';
import InputText from '../../../atoms/InputText/InputText';
import Pulldown from '../../../molecules/Pullldown/Pulldown';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';
import Button from '../../../atoms/Button/Button';
import { Link } from 'react-router-dom';
import useFetchApiData from "../../../hooks/useFetchApiData";
import { paramState } from '../../../store/paramState';
import { useTranslation } from 'react-i18next';
import BrandFilter from '../../common/Filter/BrandFilter';
import SizeFilter from '../../common/Filter/SizeFilter';
import ColorFilter from '../../common/Filter/ColorFilter';
import TagFilter from '../../common/Filter/TagFilter';
import { CONST } from '../../../constants/constants';
import CategoryFilter from '../../common/Filter/CategoryFilter';


const ItemSearchModal = memo(({
  onClick
}) => {

  const baseUrl = `/api/user/items/option`;
  const model = 'ITEM';
  const [params, setParams] = useRecoilState(paramState(model));
  const { handleFilter, handleFilterCheckbox, handleFilterCategory, handleSort } = useCreateParams(model);
  const { data, errorMessage } = useFetchApiData(baseUrl, model);
  const { brands, gender_categories, main_categories, sub_categories, sizes, colors, tags } = data;
  const { t } = useTranslation();

  useEffect(() => {
    if (params.scope === null) {
      setParams({
        paginate: {},
        sort: { 'price': '', 'posted_at': '' },
        filter: { 'search': '', 'tag': [], 'color': [], 'size': [], 'brand': [], 'gender_category': '', 'main_category': '', 'sub_category': '', 'price_from': '', 'price_to': '', 'stock_status': '' },
        scope: model
      });
    }
  }, []);

  return (
    <div className={styles.container}>
      {errorMessage && errorMessage.httpRequestError ? (
        <Text role='error'>{errorMessage.httpRequestError}</Text>
      ) : (
        <>
          <Text size='l' className={[styles.mb_24, styles.text_center].join(' ')}>{t('user.set-filter')}</Text>

          <div className={styles.mb_16}>
            <label htmlFor='search'>
              <Text className={styles.mb_8}>{t('user.keyword')}</Text>
            </label>
            <InputText
              type='text'
              name='search'
              onBlur={handleFilter}
              value={params.filter.search}
              placeholder={t('user.item.keyword-ex')}
              className={styles.w_100}
            />
          </div>

          <BrandFilter
            brands={brands}
            params={params.filter.brand}
            onChange={handleFilterCheckbox}
            className={styles.mb_16}
          />

          <CategoryFilter
            gender_categories={gender_categories}
            main_categories={main_categories}
            sub_categories={sub_categories}
            params={params.filter}
            onChange={handleFilterCategory}
            className={styles.mb_16}
          />

          <SizeFilter
            sizes={sizes}
            params={params.filter.size}
            onChange={handleFilterCheckbox}
            className={styles.mb_16}
          />

          <ColorFilter
            colors={colors}
            params={params.filter.color}
            onChange={handleFilterCheckbox}
            className={styles.mb_16}
          />

          <TagFilter
            tags={tags}
            params={params.filter.tag}
            onChange={handleFilterCheckbox}
            className={styles.mb_16}
          />

          <div className={styles.mb_16}>
            <label htmlFor='price_from'>
              <Text className={styles.mb_8}>{t('user.item.price-range')}</Text>
            </label>
            <div className={[styles.flex_row, styles.align_center].join(' ')}>
              <InputText
                type='number'
                name='price_from'
                onBlur={handleFilter}
                value={params.filter.price_from}
                placeholder={t('user.item.price-low-ex')}
                className={styles.w_100}
              />
              <Text className={styles.ma}>~</Text>
              <InputText
                type='number'
                name='price_to'
                onBlur={handleFilter}
                value={params.filter.price_to}
                placeholder={t('user.item.price-high-ex')}
                className={styles.w_100}
              />
            </div>
          </div>

          <div className={styles.mb_32}>
            <Text className={styles.mb_8}>{t('user.item.stock-status')}</Text>
            <Pulldown name='stock_status' value={params.filter.stock_status} onChange={handleFilter} initialLabel={t('user.not-set')}>
              <option value={CONST.STOCK_OPTION.ALL}>{t('user.item.all')}</option>
              <option value={CONST.STOCK_OPTION.STOCK_ONLY}>{t('user.item.stock-only')}</option>
            </Pulldown>
          </div>

          <Text size='l' className={[styles.mb_24, styles.text_center].join(' ')}>{t('user.set-sort')}</Text>

          <div className={styles.mb_16}>
            <Text className={styles.mb_8}>{t('user.item.price')}</Text>
            <Pulldown name='price' value={params.sort.price} onChange={handleSort} initialLabel={t('user.not-set')}>
              <option value={'desc'}>{t('user.desc-num')}</option>
              <option value={'asc'}>{t('user.asc-num')}</option>
            </Pulldown>
          </div>

          <div className={styles.mb_32}>
            <Text className={styles.mb_8}>{t('user.posted-date')}</Text>
            <Pulldown name='posted_at' value={params.sort.posted_at} onChange={handleSort} initialLabel={t('user.not-set')}>
              <option value={'desc'}>{t('user.desc-date')}</option>
              <option value={'asc'}>{t('user.asc-date')}</option>
            </Pulldown>
          </div>

          <div className={[styles.flex_row, styles.justify_center].join(' ')}>
            <Button className={styles.mr_8} onClick={onClick}>{t('user.close-btn')}</Button>
            <Button color='primary' onClick={onClick}>
              <Link to={{ pathname: "/items" }} style={{ 'color': '#fff' }}>{t('user.search-btn')}</Link>
            </Button>
          </div>
        </>
      )
      }
    </div>
  );
});

export default ItemSearchModal;