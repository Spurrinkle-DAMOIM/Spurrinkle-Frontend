import * as React from 'react';
import {AppBar, Box, Toolbar, IconButton, Typography,
    Container, Button, MenuItem} from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import boardMain from "../pages/board/BoardMain";
import {createBrowserHistory} from 'history';
import font from "../css/font.css";
import Alert from 'sweetalert2';

const pages = ['교내게시판', '모임', '마이페이지'];

const menuItems = [
    {
        menuTitle: "교내게시판",
        pageURL: "/"
    },
    {
        menuTitle: "모임",
        pageURL: "/meetings/1"
    },
    {
        menuTitle: "마이페이지",
        pageURL: "/myPage"
    }
];


function ResponsiveAppBar() {
    const history = createBrowserHistory();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const open = Boolean(anchorElNav);

    const handleMenuClick = (pageURL) => {
        console.log('클릭됨')
        history.push(pageURL);

        setAnchorElNav(null);
        window.location.reload();
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };


    const handleCloseNavMenu = () => {
        console.log("닫혔음")


        setAnchorElNav('');
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    }

    const handleButtonClick = (pageURL) => {
        history.push(pageURL);
        console.log("멈춰!")
        window.location.reload();

    };

    return (

        <Box sx={{flexGrow: 100, display: 'flex', flexWrap: 'wrap'}}>

            <AppBar position="static" style={{backgroundColor: 'steelblue'}}>
                <Container style={{backgroundColor: "steelblue"}} maxWidth="xl">
                    {/*//250223112*/}
                    <Toolbar disableGutters>
                        <div style={{paddingLeft: "130px"}}>
                            <Typography
                                variant="h4"
                                noWrap
                                component="a"
                                href='/'
                                sx={{
                                    mr: 4,
                                    display: {xs: 'none', md: 'flex'},
                                    fontFamily: 'ImcreSoojin',
                                    letterSpacing: '.3rem',
                                    textDecoration: 'none',
                                    fontSize: "50px",
                                    color: '#DCE4ED',
                                    paddingTop: "14px",
                                    paddingBottom: "14px"
                                }}
                            >
                                DAMOIM
                            </Typography>
                        </div>

                        <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={open}
                                onClose={() => setAnchorElNav(null)}
                                sx={{
                                    display: {xs: 'block', md: 'none'},
                                }}
                            >
                                {menuItems.map((menuItem) => {
                                    const {menuTitle, pageURL} = menuItem;
                                    return (
                                        <MenuItem onClick={() => handleMenuClick(pageURL)}>
                                            {menuTitle}
                                        </MenuItem>
                                    );
                                })}
                            </Menu>
                        </Box>
                        {/*아이콘 들어 갈 자리*/}
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: {xs: 'flex', md: 'none'},
                                flexGrow: 1,
                                fontFamily: 'ImcreSoojin',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: '#DCE4ED',
                                textDecoration: 'none'
                            }}
                        >
                            DAMOIM
                        </Typography>
                        {/*#FADF70*/}
                        <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}, backgroundColor: 'steelblue'}}>
                            <div style={{width: '80%', paddingLeft: "120px"}}>
                                <Button
                                    onClick={() => handleButtonClick("/")}
                                    style={{color: '#DCE4ED', fontSize: '26px', fontFamily: 'ImcreSoojin',}}
                                >
                                    교내게시판
                                </Button>
                                <Button
                                    onClick={() => {
                                        const id = sessionStorage.getItem("id");
                                        if (id === null) {
                                            Alert.fire({
                                                html: "로그인이 필요합니다",
                                                icon: "warning",
                                                confirmButtonColor:"#1976D2",
                                                confirmButtonText: "확인"
                                            });
                                        } else {
                                            handleButtonClick("/meetings/1")};
                                        }
                                    }
                                    style={{
                                        color: '#DCE4ED',
                                        fontSize: '26px',
                                        marginLeft: '120px',
                                        fontFamily: 'ImcreSoojin',
                                    }}
                                >
                                    모임
                                </Button>
                                <Button
                                    onClick={() => {
                                        const id = sessionStorage.getItem("id");
                                        if (id === null) {
                                            Alert.fire({
                                                html: "로그인이 필요합니다",
                                                icon: "warning",
                                                confirmButtonColor:"#1976D2",
                                                confirmButtonText: "확인"
                                            });
                                        } else {
                                            handleButtonClick("/myPage");
                                        }
                                    }
                                    }
                                    style={{
                                        color: '#DCE4ED',
                                        fontFamily: 'ImcreSoojin',
                                        fontSize: '26px',
                                        marginLeft: '120px'
                                    }}
                                >
                                    마이페이지
                                </Button>
                            </div>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>

    );
}

export default ResponsiveAppBar;