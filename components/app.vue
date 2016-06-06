<template>
    <main>
        <header>
            <ul id="nav">
                <li><a v-link="{ path: '/combined' }" class="nav-link">Combined</a></li>
                <li><a v-link="{ path: '/cluster' }" class="nav-link">Cluster</a></li>
                <li><a v-link="{ path: '/logger' }" class="nav-link">Logger</a></li>
                <li><a v-link="{ path: '/view' }" class="nav-link">View</a></li>
            </ul>


        </header>

        <router-view></router-view>

    </main>
</template>

<script>
    import Analyzer from './analyzer';
    import Object3 from 'awv3/three/object3';
    import SocketIO from 'awv3/communication/socketio';
    import { state } from './store';

    export default {
        data: () => ({ url: "http://localhost:8181" }),
        async ready() {
            await new Analyzer().connect(this.url);

            function addModels(context) {
                let object = new Object3(context)
                    .setPosition(Math.random() * 1000 - 500, Math.random() * 1000 - 500, Math.random() * 1000 - 500)
                    .setRotation(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);
                state.view.scene.add(object);
                state.view.updateBounds().controls.zoom().focus();
            }

            // Make connections first
            let promises = [];
            for (let i = 0; i < 10; i++)
                promises.push(new SocketIO().connect(this.url));

            // When done, start executing tasks
            Promise.all(promises).then(connections => {
                Promise.all(connections.map(async connection => {
                    let { models:first } = await connection.execute(`
                        _C.ToolDesigner3d.InitApplication("Drawings/3dToolDesigner/3dToolDesigner.of1");
                        _O.ToolDesigner3d.LoadExistingTool("Drawings/ISO_Tool/Demo_Tool.of1");`);
                    addModels(first);
                    let { models:second } = await connection.execute(`
                        _O.ToolDesigner3d.SetComponentParams("EXTENSION",["LB", "BD"],[150, 100]);
                        _O.ToolDesigner3d.GetComponentParams("EXTENSION");`);
                    addModels(second);
                    let { models:third } = await connection.execute(`
                        _O.ToolDesigner3d.SetComponentParams("EXTENSION",["LB", "BD"],[250, 200]);
                        _O.ToolDesigner3d.GetComponentParams("EXTENSION");`);
                    addModels(third);
                    console.log("disconnect")
                    connection.disconnect();
                }));
            });
        }
    }
</script>

<style scoped>
    a {
      text-decoration: none;
      color: #34495e;
    }
    #nav {
      list-style-type: none;
      margin: 0;
      padding: 0;
      right: 60px;
      top: 25px;
      height: 40px;
      line-height: 40px;
      float: right;
    }
    #nav .break {
      display: none;
    }
    #nav li {
      display: inline-block;
      position: relative;
      margin: 0 0.6em;
    }
    .nav-link {
      padding-bottom: 3px;
    }
    .nav-link:hover,
    .nav-link.v-link-active {
      border-bottom: 3px solid #42b983;
    }
    main { display: flex; flex-direction: column; width: 100%; height: 100%; position: absolute; }
    header { background-color: #fff;
    box-shadow: 0 0 4px rgba(0,0,0,0.25);
    padding: 25px 60px;
    position: relative;
    z-index: 2; }
</style>
