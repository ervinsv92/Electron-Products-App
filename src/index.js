const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })
}

let mainWidow;
let newProductWindow;

app.on("ready", () => {
    mainWidow = new BrowserWindow();

    //mainWidow.loadURL(`file://${__dirname}/views/index.html`);
    mainWidow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: "file",
        slashes: true
    }));

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    mainWidow.on('closed', () => {
        app.quit();
    })

});

function createNewProductWindow() {
    newProductWindow = new BrowserWindow({
            width: 400,
            height: 330,
            title: 'Add a new product'
        })
        //newProductWindow.setMenu(null)
    newProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/new-product.html'),
        protocol: "file",
        slashes: true
    }));

    newProductWindow.on('closed', () => {
        newProductWindow = null;
    })
}

ipcMain.on('product:new', (e, newProduct) => {
    mainWidow.webContents.send('product:new', newProduct);
    newProductWindow.close();
})

const templateMenu = [{
    label: 'File',
    submenu: [{
            label: 'New Product',
            accelerator: 'Ctrl+N',
            click() {
                createNewProductWindow();
            }
        },
        {
            label: 'Remove All Products',
            click() {
                mainWidow.webContents.send("products:remove-all")
            }
        },
        {
            label: 'Exit',
            accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
            click() {
                app.quit();
            }
        }
    ]
}];

//para saber si es MAC
if (process.platform === 'darwin') {
    templateMenu.unshift({
        label: app.getName()
    })
}

if (process.env.NODE_ENV !== 'production') {
    templateMenu.push({
        label: 'Dev Tools',
        submenu: [{
                label: 'Show/Hide Dev tools',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}