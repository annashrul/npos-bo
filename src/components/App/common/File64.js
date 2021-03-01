import React from 'react';

export default class File64 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      types:{
            png:'image/png',
            jpg:'image/jpeg',
            gif:'image/gif',
            svg: 'image/svg+xml',
            txt: 'text/plain',
            zip: 'application/zip',
            csv: 'text/csv',
            xls: 'application/vnd.ms-excel',
            ico: 'image/vnd.microsoft.icon',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      },
      images:'',
      error:''
    };
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    this.setState({error: '',files:[],images:''})
    const errMsg = {
      max:{
        en: `Your file is too big. Please upload file smaller than ${this.props.maxSize} kb.`,
        id: `File terlalu besar. Silahkan upload file dengan ukuran lebih kecil dari ${this.props.maxSize} kb`
      },
      type:{
        en: `You may only upload ${this.props.fileType} files. Please ensure your file is in one of these format`,
        id: `Anda hanya bisa mengupload file ${this.props.fileType}. Mohon pastikan file anda termasuk salah satu format tersebut.`
      }
    }
    let files = e.target.files;
    var allFiles = [];
    for (var i = 0; i < files.length; i++) {
      let file = files[i];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const size = Math.round(file.size / 1000);
        if (size > parseInt(this.props.maxSize,10)){
          this.setState({
            error: errMsg.max[this.props.lang]
          })
          this.props.onDone({
            msg: errMsg.max[this.props.lang],
            status: 'failed'
          });
          return false;
        }
        const checkType = this.checkingType(file.type);
        console.log(checkType);
        if (!checkType) {
          this.setState({
            error: errMsg.type[this.props.lang]
          })
          this.props.onDone({
            msg: errMsg.type[this.props.lang],
            status: 'failed'
          });
          return false;
        }else{
          let fileInfo = {
            name: file.name,
            type: file.type,
            size: size,
            base64: reader.result,
            file: file,
            status: 'success'
          };
          allFiles.push(fileInfo);
          this.setState({
            files:fileInfo,
            images:reader.result
          })
          if(allFiles.length === files.length){
            if(this.props.multiple) this.props.onDone(allFiles);
            else this.props.onDone(allFiles[0]);
          }

        }

      } // reader.onload

    } // for

  }

  checkingType(type){
    const types = (this.props.fileType).split(',');
    const checking = types.map((item, key) =>{
        const itemClear = item.trim();
        return this.state.types[itemClear] === type
    })
    if(checking.indexOf(true)>=0) return true;
    else return false;
  }

  render() {
    return (
      <div>
        <input
          style={{display:'none'}}
          type="file"
          name={"imageUpload"+this.props.ids}
          id = {"imageUpload"+this.props.ids}
          onChange={ this.handleChange.bind(this) }
          className={this.props.className}
          multiple={ this.props.multiple } />
        <label 
          htmlFor={"imageUpload"+this.props.ids}
          // onclick = "javascript:document.getElementById('imageUpload').click();"
          style = {{
              width: '30%',
              float: 'left',
              cursor: 'pointer',
              backgroundColor: '#EEEEEE',
              borderColor: '#34465B',
              transition: '400ms',
              fontSize: '.9em',
              borderRadius: '.15rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
              display: 'inline-block',
              color: '#333333',
              textAlign: 'center',
              verticalAlign: 'middle',
              userSelect: 'none',
              border: '1px solid transparent',
              padding: '.55rem .75rem',
              lineHeight: '1.2'
          }} > {this.props.lang==='en'?'Select file':'Pilih berkas'} </label> 
        <div 
          style = {{
              paddingTop: '10px',
              paddingLeft: '10px',
              fontSize: '.8em',
              width: "70%",
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              float: 'left'
            }} > 
            {
              this.state.files.name ? this.state.files.name : this.props.lang === 'en' ? 'No file selected.' : 'Belum ada file yang dipilih.'
            } 
        </div>
        <div style={{clear:'both'}}></div>
        {
          this.state.error!==''?
          <label id="password-error" style={{fontSize:'0.7rem',color:'#dc3545',marginTop:'.1rem'}} htmlFor="password">{this.state.error}</label>:''
        }
        {
          this.props.showPreview?(
            <div style={{margin:this.props.previewAlign==='center'?'0 auto':'',width:this.props.previewConfig.width,height:this.props.previewConfig.height}}>
              <img alt="images" className='img-responsive' src={this.state.images===''?this.props.previewLink:this.state.images} width={this.props.previewConfig.width} height={this.props.previewConfig.height}/>
            </div>
          ):''
        }
      </div>
    );
  }
}

File64.defaultProps = {
  multiple: false,
  maxSize: 1000, // on kb,
  fileType: 'all',
  className:'',
  ids:'uid',
  showPreview:true,
  previewAlign:'center',
  previewLink: 'http://ptnetindo.com:6692/images/default.png',
  lang:'en',
  previewConfig:{
    width:'150px',
    height:'150px'
  }
};