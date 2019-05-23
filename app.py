from flask import Flask, render_template, request, redirect, url_for
from flask_bootstrap import Bootstrap
from livereload import Server
import GAN as gan
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import json
import random

app = Flask(__name__)
app.Debug = True
app.debug = True
signed = False
user_type = None


@app.route('/')
def begin():
    return render_template('Login.html')


@app.route('/', methods=['GET', 'POST'])
def user():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == '111':
            if password == '111':
                signed = True
                user_type = 'consumer'
                return redirect(url_for('usermain'))
        if username == '222':
            if password == '222':
                signed = True
                user_type = 'distributor'
                return redirect(url_for('distributor'))
        if username == '333':
            if password == '333':
                signed = True
                user_type = 'delivery'
                return redirect(url_for('delivery'))

@app.route('/usermain')
def usermain():
    return render_template('User Main.html', goods=goods, cla=cla)


@app.route('/usermain/userinformation')
def userinformation():
    return render_template('User-information.html')


@app.route('/usermain/purchasing/<goods_id>')
def purchasing(goods_id):
    gid = goods_id
    id_rand = random.sample(ids, 3)
    return render_template('purchasing.html', goods_id=gid, goods=goods, ids=id_rand)


@app.route('/usermain/catabrand')
def catabrand():
    return render_template('Catalog Brands.html', brd=brands_collect, goods=goods)


@app.route('/usermain/category', methods=['GET', 'POST'])
def category():
    return render_template('Catalog category.html', goods=goods)


@app.route('/distributor')
def distributor():
    return render_template('Distributor.html')


@app.route('/delivery/delivery_sav')
def change():
    return render_template('NR-VRP.html')


@app.route('/delivery')
def delivery():
    return render_template('Delivery.html', gadk=[list(cX), list(cY), list(cD)], imagename1='images/scatter.png')


@app.route('/delivery/process', methods=['GET', 'POST'])
def process():
    tsp = gan.GA(50, 300, 0.25, 0.02, cLabel, cX, cY, cD, dLabel, dX, dY, (1, 1))
    tsp.process()
    tsp.drawgen()
    tsp.drawbestline()
    path = tsp.bestcode[-1]
    cal = True
    return render_template('Delivery.html', gadk=[list(cX), list(cY), list(cD)], imagename1='images/scatter.png'
                           , imagename2='images/drawbestline.png', path=str(path))


if __name__ == '__main__':
    customer = pd.read_csv('static/Customer.csv')
    distribution = pd.read_csv("static/Distribution.csv")
    cLabel = np.array(customer.iloc[:, 0])
    cX = np.array(customer.iloc[:, 1])
    cY = np.array(customer.iloc[:, 2])
    cD = np.array(customer.iloc[:, 3])
    dLabel = np.array(distribution.iloc[:, 0])
    dX = np.array(distribution.iloc[:, 1])
    dY = np.array(distribution.iloc[:, 2])
    origin = (1, 1)
    plt.plot(cX, cY, 'o')
    plt.plot(dX, dY, 'o')
    plt.plot(1, 1, 'o')
    for i in range(cX.shape[0]):
        plt.text(cX[i], cY[i], cLabel[i], family='serif', ha='right', wrap=True)
        plt.text(cX[i], cY[i] + 0.5, 'Demand:' + cD[i], family='serif', ha='right', wrap=True)
    for i in range(dX.shape[0]):
        plt.text(dX[i], dY[i], dLabel[i], family='serif', ha='right', wrap=True)
    plt.savefig('./static/images/scatter.png')
    plt.close()
    cal = False

    with open("static/lag/goods/goods.json", encoding='utf-8') as g:
        g.seek(0)
        goods = json.load(g)

    brands_collect = []
    ids = []
    cla = []
    for i in goods['costume']:
        for j in goods['costume'][i]:
            brands_collect.append(j['brand'])
            ids.append(j['ID'])
            cla.append(j['class'])
    brands_collect = list(set(brands_collect))
    cla = list(set(cla))

    live_server = Server(app.wsgi_app)
    # live_server.watch("**/*.*")
    live_server.serve(open_url=False)
    # app.run(host="0.0.0.0", port=5000, debug=False)
