import React, {memo} from 'react';
import styles from './styles.module.css';
import {TableHeadCell as Th} from '../../../atoms/TableHeadCell/TableHeadCell';
import {TableBodyCell as Td} from '../../../atoms/TableBodyCell/TableBodyCell';
import { TableRow as Row } from '../../../atoms/TableRow/TableRow';

const MeasurementTable = ({measurements, sizes, className = '', ...props}) => {

  return (
    <div {...props}>
      <table className={[styles.table, className].join(' ')}>
        <thead>
          <Row>
            <Th className={styles.th}>サイズ</Th>
            <Th className={styles.th}>身幅</Th>
            <Th className={styles.th}>肩幅</Th>
            <Th className={styles.th}>裄丈</Th>
            <Th className={styles.th}>袖丈</Th>
            <Th className={styles.th}>着丈</Th>
            <Th className={styles.th}>ウエスト</Th>
            <Th className={styles.th}>ヒップ</Th>
            <Th className={styles.th}>股上</Th>
            <Th className={styles.th}>股下</Th>
            <Th className={styles.th}>わたり</Th>
            <Th className={styles.th}>パンツ総丈</Th>
            <Th className={styles.th}>スカート丈</Th>
            <Th className={styles.th}>裾幅</Th>
            <Th className={styles.th}>重量</Th>
          </Row>
        </thead>
        <tbody>
        {   measurements && sizes &&
            measurements.map((list, index) =>
                <Row key={index}> 
                    {
                        sizes.filter(size => size.id == list.size_id).map(s => (
                            <Td className={[styles.td, styles.bg_gray].join(' ')} key={s.id}>{s.size_name}</Td>
                        ))
                    }
                    <Td className={styles.td}>{list.width}</Td>
                    <Td className={styles.td}>{list.shoulder_width}</Td>
                    <Td className={styles.td}>{list.raglan_sleeve_length}</Td>
                    <Td className={styles.td}>{list.sleeve_length}</Td>
                    <Td className={styles.td}>{list.length}</Td>
                    <Td className={styles.td}>{list.waist}</Td>
                    <Td className={styles.td}>{list.hip}</Td>
                    <Td className={styles.td}>{list.rise}</Td>
                    <Td className={styles.td}>{list.inseam}</Td>
                    <Td className={styles.td}>{list.thigh_width}</Td>
                    <Td className={styles.td}>{list.outseam}</Td>
                    <Td className={styles.td}>{list.sk_length}</Td>
                    <Td className={styles.td}>{list.hem_width}</Td>
                    <Td className={styles.td}>{list.weight}</Td>
                </Row>
            )
        }
        </tbody>
      </table>
    </div>
  );
};

export default MeasurementTable;