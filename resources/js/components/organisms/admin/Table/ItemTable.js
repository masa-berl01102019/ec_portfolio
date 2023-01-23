import React, {memo, useState} from 'react';
import styles from './styles.module.css';
import InputCheckbox from '../../../atoms/InputCheckbox/InputCheckbox';
import useInputCheckBox from '../../../hooks/useInputCheckBox';
import {TableHeadCell as Th} from '../../../atoms/TableHeadCell/TableHeadCell';
import {TableBodyCell as Td} from '../../../atoms/TableBodyCell/TableBodyCell';
import EditLink from '../../../molecules/IconLink/EditLink';
import DeleteBtn from '../../../molecules/IconBtn/DeleteBtn';
import DownloadCsvBtn from '../../../molecules/IconBtn/DownloadCsvBtn';
import { TableRow as Row } from '../../../atoms/TableRow/TableRow';
import useNotify from '../../../context/NotifyContext';
import useI18next from '../../../context/I18nextContext';


const ItemTable = ({items, className = '', deleteMethod, csvOutputMethod}) => {

  const [checklist, {setChecklist, handleCheck, handleUnCheckAll, handleCheckAll}] = useInputCheckBox();
  const [checkItemAll, setCheckItemAll] = useState(false);
  const confirm = useNotify();
  const i18next = useI18next();

  const handleConfirmDelete = async () => {
      const result = await confirm({
          body : i18next.t('admin.delete-confirm', {count: checklist.length}),
          confirmBtnLabel : i18next.t('admin.delete-btn')
      });
      result && deleteMethod({url:`/api/admin/items`, form:checklist, callback: () => setChecklist([])});
  }

  return (
    <>
      <div style={{'display': 'flex', 'marginBottom': '16px'}}>
        <DeleteBtn onClick={handleConfirmDelete} className={styles.mr}>{i18next.t('admin.delete-all-btn')}</DeleteBtn>
        <DownloadCsvBtn onClick={() => { 
          csvOutputMethod({ 
            url:`/api/admin/items/csv`, 
            form:checklist 
          }); 
        }}>{i18next.t('admin.csv-output')}</DownloadCsvBtn>
      </div>
      <div className={className}>
        <table className={styles.table}>
          <thead className={styles.fix_theader} >
            <Row>
              <Th>
                { checkItemAll ? (
                  <InputCheckbox
                    onChange={() => {
                      handleUnCheckAll();
                      setCheckItemAll(false);
                    }} 
                    value={true} 
                    checked={checkItemAll} 
                    className={styles.table_check}
                  />
                ) :(
                  <InputCheckbox 
                    onChange={() => {
                      handleCheckAll(items); 
                      setCheckItemAll(true);
                    }} 
                    value={false} 
                    checked={checkItemAll} 
                    className={styles.table_check}
                  />
                )}
              </Th>
              <Th>{i18next.t('admin.id')}</Th>
              <Th>{i18next.t('admin.edit-link')}</Th>
              <Th>{i18next.t('admin.published-status')}</Th>
              <Th>{i18next.t('admin.item.product-number')}</Th>
              <Th>{i18next.t('admin.item.item-name')}</Th>
              <Th>{i18next.t('admin.item.price')}</Th>
              <Th>{i18next.t('admin.item.cost')}</Th>
              <Th>{i18next.t('admin.item.color-variation')}</Th>
              <Th>{i18next.t('admin.item.size-variation')}</Th>
              <Th>{i18next.t('admin.item.made-in')}</Th>
              <Th>{i18next.t('admin.item.mixture-ratio')}</Th>
              <Th>{i18next.t('admin.item.brand-category')}</Th>
              <Th>{i18next.t('admin.item.gender-category')}</Th>
              <Th>{i18next.t('admin.item.main-category')}</Th>
              <Th>{i18next.t('admin.item.sub-category')}</Th>
              <Th>{i18next.t('admin.item.related-tag')}</Th>
              <Th>{i18next.t('admin.last-updated-by')}</Th>
              <Th>{i18next.t('admin.posted-date')}</Th>
              <Th>{i18next.t('admin.updated-date')}</Th>
            </Row>
          </thead>
          <tbody>
          { items.map((item) =>
              <Row key={item.id} className={checklist.includes(item.id) ? styles.checked_row: ''}>
                <Td><InputCheckbox onChange={handleCheck} value={item.id} checked={checklist.includes(item.id)} className={styles.table_check}/></Td>
                <Td>{item.id}</Td>
                <Td><EditLink to={`/admin/items/${item.id}/edit`}>{i18next.t('admin.edit-link')}</EditLink></Td>
                <Td>{item.is_published_text}</Td>
                <Td>{item.product_number}</Td>
                <Td>{item.item_name}</Td>
                <Td>{item.price_text}</Td>
                <Td>{item.cost_text}</Td>
                <Td>{item.color_variation.join(' / ') }</Td>
                <Td>{item.size_variation.join(' / ') }</Td>
                <Td>{item.made_in}</Td>
                <Td>{item.mixture_ratio}</Td>
                <Td>{item.brand_name}</Td>
                <Td>{item.gender_category}</Td>
                <Td>{item.main_category}</Td>
                <Td>{item.sub_category}</Td>
                <Td>{item.tags.join(' / ') }</Td>
                <Td>{item.full_name && item.full_name_kana && (`${item.full_name}(${item.full_name_kana})`)}</Td>
                <Td>{item.posted_at}</Td>
                <Td>{item.modified_at}</Td>
              </Row>
            )
          }
          </tbody>
        </table>
      </div>
      {/* <p>* サイズ・カラーはSKUに登録されたものが一覧に表示されてます</p> */}
    </>
  );
};


export default ItemTable;