import React, {useRef} from 'react';
import { useParamsContext } from '../context/ParamsContext';

const useFilter = () => {

    // useContextでグローバルで管理するパラメータを取得
    const {params, setParams} = useParamsContext();
    // 期間していするフィルターの制御するためのuseRefの呼び出し
    const dateRangeField = useRef(null);
    const dateRangeStart = useRef(null);
    const dateRangeEnd = useRef(null);

    // input text用
    const handleFilterInputText = (e) => {
        console.log('handleFilterInputText直前のparams', params);
        setParams({
            ...params,
            filter: {
                ...params.filter,
                [e.target.name]: e.target.value
            }
        });
    }

    // dateRange用
    const handleFilterDateRange = () => {
        console.log('handleFilterDateRange直前のparams', params);
        // paramsを更新するとAPIをとばす仕様にしてるので、期間指定したいカラム名と開始日と終了日の３つの項目が入力されたかチェックするためにuseRefで値を取得する
        const field = dateRangeField.current.value;
        const startDate = dateRangeStart.current.value;
        const endDate = dateRangeEnd.current.value;

        if(startDate.length !== 8 || endDate.length !== 8) { // TODO フロントのバリデーション周りを実装する際にエラーを出すように修正する
            return false
        }

        if(field !== 'clear' && startDate !== '' && endDate !== '') {
            // 検索開始日と終了日を配列に格納
            let dateRange = [startDate, endDate];
            setParams({
                ...params,
                filter: {
                    ...params.filter,
                    dateRange: {
                        [field]: dateRange
                    }
                }
            });
        } else if(field === 'clear' && startDate !== '' && endDate !== '') {
            // 一度日程の範囲指定した状態で元の戻す場合、「フィールドを選択」を選択した場合にdateRangeに空のオブジェクトを代入してリセットする
            setParams({
                ...params,
                filter: {
                    ...params.filter,
                    dateRange: {}
                }
            });
        }
    }

    // input checkbox用
    const handleFilterCheckbox = (e) => {
        console.log('handleFilterCheckbox直前のparams', params);
        let new_arr; // 配列用の変数を宣言
        const name = e.target.name; // name属性にDBのカラム名を指定しているので取得
        const value = Number(e.target.value); // 渡ってきた値を取得

        if( params.filter[name].includes(value)) { // 指定のカラム名の配列に該当の値が既にないか確認
            new_arr = params.filter[name].filter(item => item !== value );
        } else {
            new_arr = params.filter[name];
            new_arr.push(value);
        }

        setParams({
            ...params,
            filter: {
                ...params.filter,
                [name]: new_arr
            }
        });
    };

    return [ dateRangeStart, dateRangeEnd, dateRangeField, { handleFilterInputText, handleFilterCheckbox, handleFilterDateRange}];

}

export default useFilter;


