import React, {useState, Suspense, memo} from 'react';
import {Link} from 'react-router-dom';
import Icon from '../../../atoms/Icon/Icon';
import styles from './styles.module.css'
import Text from '../../../atoms/Text/Text';
import Mask from '../../../atoms/Mask/Mask';
import GlobalMenu from '../GlobalMenu/GlobalMenu';
import ItemSearchModal from '../modal/ItemSearchModal';


export const Header = ({...props}) => {

    const [openMenu, setOpenMenu] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <header {...props}>
                <nav>
                    <div className={styles.header}>
                        <Icon src={'/img/menu_icon_gray.svg'} className={styles.mr_auto} onClick={() => setOpenMenu(true)}/>
                        <div className={styles.app_name}>
                            <Link to="/"><Text size='xl' className={styles.bold}>LARAVEL APP</Text></Link>
                        </div>
                        <Icon src={'/img/search_icon_gray.svg'} className={styles.mr_10} onClick={() => setOpenModal(true)}/>
                        <Link to="/carts" style={{'width': '24px', 'height': '24px'}}>
                            <Icon src={'/img/shopping_cart_icon_gray.svg'} />
                        </Link>
                    </div>
                </nav>
            </header>
            {   openMenu && 
                <Mask onClick={() => setOpenMenu(false)}>
                    <Suspense>
                        <GlobalMenu />
                    </Suspense>
                </Mask>
            }
            {  openModal && 
                <Mask>
                    <Suspense>
                        <ItemSearchModal onClick={() => setOpenModal(false)} /> 
                    </Suspense>
                </Mask>
            }
        </>
    );
};