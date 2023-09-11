<template>
  <q-page-sticky class="z-top" position="bottom-right" :offset="[50, 30]">
    <q-btn round size="lg" @click="addGroupFlg = true" color="primary" icon="add" />
  </q-page-sticky>
  <div class="q-mx-md q-my-lg" v-for="group of groups" :key="group">
    <div class="q-pa-md">
      <q-table
        :title="group"
        :rows="rows[group]"
        :columns="columns"
        row-key="name"
        style="width:auto"
      >
      <template v-slot:top-right>
        <q-btn color="red-5" @click="deleteGroup(group)">削除</q-btn>
      </template>
      <template v-slot:bottom>
        <q-btn @click="addMemberFlg = true; selectedGroup = group" round size="sm" color="primary" icon="add" />
        <div class="q-ml-sm text-subtitle2">メンバーを追加する</div>
      </template>
      <template v-slot:no-data>
        <q-btn @click="addMemberFlg = true; selectedGroup = group" round size="sm" color="primary" icon="add" />
        <div class="q-ml-sm text-subtitle2">メンバーを追加する</div>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="info" style="white-space: pre-line;" :props="props">
            {{ props.row.info }}
          </q-td>
          <q-td key="img" :props="props">
            <q-avatar round v-if="props.row.img == 'store'">
              <img @click="showImg($store.state.example.imgData[props.row.name])" :src="$store.state.example.imgData[props.row.name]" />
            </q-avatar>
            <q-avatar v-else-if="props.row.img != null" round>
              <img @click="showImg(props.row.img)" :src="props.row.img" />
            </q-avatar>
          </q-td>
          <q-td key="action" :props="props">
            <q-btn color="red-5" label="削除" @click="deleteMember(group, props.row.name)" />
          </q-td>
        </q-tr> 
      </template>
    </q-table>
    <div class="q-mt-md">
      <q-editor
        v-model="editor[group]"
        min-height="5vh"
        height="10vh"
        :definitions="{
          save: {
            tip: 'セーブする',
            icon: 'save',
            label: 'Save',
            handler: saveWork(group)
          },
        }"
        :toolbar="[
          ['bold', 'italic', 'strike', 'underline'],
          ['save', 'unordered', 'ordered']
        ]"
      />
    </div>
    </div>
  </div>
  <q-dialog v-model="addMemberFlg">
    <q-card style="width:40vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">メンバーの追加</div>
        <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form
            @submit="addMember(group)"
            @reset="onReset"
            class="q-gutter-md"
          >
            <q-input
              filled
              v-model="memberName"
              label="名前"
              hint="グループに所属するアイドルの名前"
              lazy-rules
              :rules="[ val => val && val.length > 0 || '名前は必須項目です。']"
            />

            <q-input
              filled
              autogrow
              v-model="info"
              label="メンバー情報"
            />

            <q-input
              @update:model-value="(val) => { imgFile = val[0] }"
              filled
              type="file"
              hint="画像のアップロード"
            />

            <div>
              <q-btn label="追加" type="submit" color="primary"/>
              <q-btn label="リセット" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
  </q-dialog>
  <q-dialog v-model="addGroupFlg">
    <q-card style="width:20vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">グループの追加</div>
        <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-input class="text-subtitle1" outlined v-model="groupName" label="グループ名">
            <template v-slot:append>
              <q-btn @click="addGroup" round dense flat icon="add" />
            </template>
          </q-input>
        </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="showImgFlg">
    <q-img :src="selectedImg" />
  </q-dialog>
</template>

<script>

export default {
  data() {
    return {
      groups:["BTS", "ちいかわ"],
      currentGroup:null,
      addMemberFlg: false,
      addGroupFlg: false,
      showImgFlg: false,
      selectedGroup:"",
      selectedImg:"",
      groupName:"",
      memberName:"",
      info:"",
      img:null,
      imgFile:null,
      editor:{},
      columns:
        [
          {
            name: 'name',
            required: true,
            label: 'メンバー',
            align: 'left',
            field: "name",
            sortable: true
          },
          { name: 'info', align: 'left', label: 'info.', field: 'info', sortable: true },
          { name: 'img', align:"center", label: '写真', field: 'img' },
          { name: 'action', label: 'アクション', field: 'action', sortable: true },
        ],
      rows: {
        BTS:[
        {
          name:"てて",
          info:"V",
          img:"/imgs/v.jpeg",
          action:null
        },
        {
          name:"ナムジュン",
          info:"RM",
          img:null,
          action:null
        },
      ],
      ちいかわ:[
      {
          name:"ちいかわ",
          info:`2017/5/1
            ピンク
          `,
          img:"/imgs/ちいかわ.jpg",
          action:null
        },
        {
          name:"ハチワレ",
          info:`2020/5/1
          青`,
          img:"/imgs/ハチワレ.jpg",
          action:null
        },
      ]
    }
    }
  },
  created() {
    this.setEditor()
  },
  watch: {
    imgFile(newFile) {
      console.log(newFile)
    }
  },
  methods: {
    setEditor() {
      for (let group of this.groups ) {
        this.editor[group] = ""
      }
    },
    addGroup() {
      this.groups.push(this.groupName)
      this.rows[this.groupName] = []
      this.editor[this.groupName] = ""
      this.addGroupFlg = false
      this.groupName = ""
    },
    async addMember() {
      console.log(this.imgFile)
      if (this.imgFile) {
        await this.$store.dispatch("example/saveImgData", {name: this.memberName, imgFile:this.imgFile})
        this.img = "store"
      }
      const member = {
        name: this.memberName,
        info: this.info,
        img: this.img
      }
      this.rows[this.selectedGroup].push(member)
      this.addMemberFlg = false
      this.memberName = ""
      this.info = ""
      this.img = ""
    },
    deleteGroup(delGroup) {
      this.groups = this.groups.filter(group => group != delGroup )
      delete this.rows[delGroup]
    },
    deleteMember(group, delName) {
      const delGroup = this.rows[group]
      this.rows[group] = delGroup.filter((member) => {
        return member.name != delName
      })
    },
    onReset() {
      this.memberName = ""
      this.info = ""
      this.img = ""
      this.imgFile = null
      this.$store.commit('example/removeImgData')
    },
    showImg(src) {
      this.selectedImg = src
      this.showImgFlg = true
    },
    saveWork (group) {
      this.$store.commit('example/setEditorData', {"group":group, content:this.editor[group]})
      },
  }
}
</script>