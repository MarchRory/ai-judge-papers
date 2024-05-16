# 易智阅AI阅卷平台
[预览地址](https://1713229008044-ai-judge-papers.surge.sh) [下载构建产物](https://ai-judge-papers.surge.sh/dist.tar.gz)

> 持续集成

## 背景

2024 中国大学生服务外包创新创业大赛[A01]赛题

## 前端开发人员
负责人: 杨荣兴

### 教师端
- 杨荣兴
- 杨瑞

### 学生端
- 刘祎晗

## 前端技术栈

| 分类             | 选型                                 |
| ---------------- | ------------------------------------ |
| 框架             | Vue3 全家桶                          |
| 状态管理         | Pinia                                |
| 语言             | TypeScript                           |
| 后台模板         | Acro-Design-pro-vue                  |
| 组件库           | Arco-Design-vue                      |
| CSS 框架         | UnoCSS, 这种规模的项目用原子化方便    |
| 图标集           | iconify 里挑一个, 感觉 tabler 还行   |
| 第三方 hooks 库  | VueUse                               |
| 网络请求库(待选) | axios |

## vsocde 插件建议

安装 `Git History`, 为自己模块负责

## 项目团队编码规范

> 格式化由 eslint 和 prettier 完成。

统一编码规范是为了让代码风格统一，方便协作开发时相互理解彼此的代码逻辑。可以有一定自己的代码风格，但有必要时候最好写上注释

### 1、TypeScript

- 命名

我们把自己自定义的 TS 类型拆分为以下几类：

| 分类                   | 命名格式 (统一大驼峰)                      | 说明                                                                                                                                                                                     |
| ---------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 一般类型               | `XXXType`                                  | 自身独立的类型，不需要继承其他类型，也不会被其他类型继承                                                                                                                                 |
| 通用基础类型           | `BaseXXXX`                                 | 通用基础类型，是一些业务场景下的某些类型的通用参数部分。它自身不一定是一个完整的类型，主要作用为被其他类型继承或联合，组合为一个业务场景下的完整类型。如基本分页参数类型`BasePagination` |
| 由 type 计算得到的类型 | `XXXType`                                  | 顾名思义                                                                                                                                                                                 |
| 泛型类型               | `ExampleType<T = string, R = XXXModel<T>>` | 顾名思义, 每一个泛型最好设置一下默认类型                                                                                                                                                 |
| 请求参数               | 按照上面的来就行                           | 网络请求时携带的参数的类型                                                                                                                                                               |
| 响应数据               | `ResponseModel<T = any>`                   | 封装的请求库统一抛出`response.data`, `ResponseModel<T = any>`定义其数据结构, 这一块和后端商议决定, 传入的泛型是其中的 data/Result 的具体类型                                             |
| todo                   | todo                                       | todo                                                                                                                                                                                     |

---

<br/>



```ts
// 使用 []
let iKunSayings: string[] = ['食不食油饼', '你干嘛', '香精煎鱼'];
let ages: number[] = [18, 20];

// 使用 Array<T>
interface BaseStudent {
  id: string;
  name: string;
  school: string;
  grade: number;
  class: number;
}

let students: BaseStudent[] = [{ id: 1, name: '张三', school: '理塘纯真高中', grade: 2, class: 2 }];
```

<br/>

- 自己写的 TS 工具和自动类型推导

写好注释

<br/>

- 类型的存放位置

- 通用、页面、工具的类型统一存放在`src/types`目录下，按照 功能模块 / 页面模块 划分。其中，`common.ts`统一存放通用基础类型并对外暴露, 其他类型文件按需引入通用基础类型。
- store 中个别模块要用到的类型可以配置在和其 index 同级的 type.ts 里, 自己二次封装的一些库，例如 request 或者 websocket 同理。

**原则上应该避免在组件里写过于复杂的类型运算**

todo...

### 2、Vue

- 页面和通用组件的目录结构
  统一为以下：

```bash
├── views / components
│   ├── pageName / componentName  # 页面模块名或通用组件名
│          └── components         # 独属于该页面或者组件的子组件, 可以是表单Modal，或者是组件的组成部分
│                   └── XxxYyy.vue  # 配置文件
│          └── index.vue          # 页面或者组件的入口
```

> 子页面的文件夹和父页面可以同级，尽量避免文件层级太深。页面文件夹命名要和 url 上的名字一一对应

- 合理使用组件异步导入
- 使用 auto-import 插件自动导入 vue API, 就不用再自己手动按需引入了
- 组件名大驼峰
- 组件编写顺序(看用不用 UnoCSS): script -> template -> style
- 有行数较多或者逻辑较复杂、或自觉命名不太清晰的方法，要写上必要的注释

```html
<script lang="ts" setup>
  /*
   * @author: 理塘王
   * @date: 2024-02-07
   */
  import { StudentType } from '@/types/student';
  const stu: StudentType[] = [];
</script>

<template>
  <div>
    <!-- 如果使用UnoCSS, 统一使用属性形式写css -->
    <p text="cyan-400">Hello World</p>
  </div>
</template>

<style scoped>
  /* 有子组件的话, 注意样式穿透的问题 */
</style>
```

- 组件的 script 首行写签名，内容至少包括 author, date

### 3、\<Transition> 和 \<Transition-Group>

试卷列表增删题目时，需要加过渡动画

过渡动画的样式统一写在`src/styles/transition.css`中

### 4、utils 和 hooks

每个工具方法和钩子都做好必要的注释

### 5、网络请求

基本的封装要求：

- 携带 token
- BASE_URL 可根据传入的第三个拓展功能中的参数进行替换, 方便必要时个别接口的联调
- 统一处理请求错误：和后端约定好, 维护一份 code 枚举, 对不同 code 进行错误处理
- 返回数据: 统一返回`response.data`, 且代码提示完备
- 接口管理: 在对应模块里使用枚举统一管理, schme 单独提取出来，预防后端重构接口时，前端需要修改
- API 分模块管理, 封装后使用的预期格式如下, 也可以根据实际需求调整优化

**Example:**

```ts
import request from '@/utils/axios';
import type { LoginModel, LoginParamsModel } from '@/types/user';
import type { RequestExpandConfig } from '@/types/request';
const schema = 'user';
const enum userAPI {
  logout = `${schema}/front/logout`,
  code = `${schema}/mails/mailCode`,
  register = `${schema}/front/register`,
  login = `${schema}/front/login`,
  getInfo = `${schema}/front/info`,
  retrievePwd = `${schema}/front/retrieve`
}
/**
 * 用户登录
 * @param data
 * @returns
 */
export function loginAPI(data: LoginParamsModel, expandConfig?: RequestExpandConfig = {}) {
  return request.post<LoginModel>(
    {
      url: userAPI.login,
      data
    },
    expandConfig
  );
}
```

### 6、自定义Hooks
#### 6.1、效率和统一分类
- useTable
统一的load相关逻辑

- useForm
统一表单提交逻辑


#### 6.2、功能封装
- usePolling: 封装的短轮询方法，引入竞态令牌，可控化轮询。

