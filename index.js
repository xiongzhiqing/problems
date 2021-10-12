// 关键套路初相见：全排列问题 -- 是高中数学里的一个概念。（从n个不同元素中任取m（m≤n）个元素，按照一定的顺序排列起来，叫做从n个不同元素中取出m个元素的一个排列。当m=n时所有的排列情况叫全排列。）

/**
 * 题目1：
 * 给定一个没有重复数字的排序，返回其所有可能的全排序。
 *
 * 示例：
 * 输入：[1,2,3]
 * 输出：[
 *  [1,2,3],
 *  [1,3,2],
 *  [2,1,3],
 *  [2,3,1],
 *  [3,1,2],
 *  [3,2,1],
 * ]
 *
 * 解法（思路分析）：
 *
 * "当我们感到变化难以把握时，不如尝试先从不变的东西入手。"
 *
 * 列举“路径”，我们首先要找到“坐标”。
 *
*/

const permute = function (nums) {
  // 缓存数组的长度
  const len = nums.length
  // cur 变量用来记录当前的排序内容
  const cur = []
  // res 用来记录所有的排列循序
  const res = []
  // visited 用来避免重复使用同一个数字
  const visited = {}

  // 定义 dfs 函数， 入参是坑位的索引（从0计数）
  function dfs (nth) {
    // 若遍历到了不存在的坑位（第len + 1个），则碰触递归边界返回
    if (nth === len) {
      // 此时前 len 个坑位已经填满，将对应的排列记录下来
      res.push(cur.slice())
      return
    }
    for (let i = 0; i < len; i++) {
      // 若 nums[i] 之前没有被其他坑位用过， 则可以理解为 “这个数字剩下了”
      if (!visited[nums[i]]) {
        // 给 num[1] 打个 ‘已用过’ 的标
        visited[nums[i]] = 1
        // 将nums[i]推入当前排列
        cur.push(nums[i])
        // 基于这个排列继续往下一个坑位走去
        dfs(nth + 1)
        // nums[i]让出当前坑位
        cur.pop()
        // 下掉‘已用过’的标识
        visited[nums[i]] = 0
      }
    }
  }
  // 从索引0的坑位（也就是第一个坑位）开始 dfs
  dfs(0)
  return res
}



console.log(permute([1, 2, 3]), 'permute')

// 组合问题：变化的“坑位”，不变的套路

/**
 * 题目2：
 * 给定一组不含重复元素的整数数组 nums，返回该数组所有可能的子集（幂集）。
 *
 * 说明：
 * 解集不能包含重复的子集。
 *
 * 示例：
 * 输入：[1,2,3]
 * 输出：[
 *  [3],
 *  [1],
 *  [2],
 *  [1,2,3],
 *  [1,3],
 *  [2,3],
 *  [1,2],
 *  []
 * ]
 *
 * 解法（思路分析）：
 * 穷举，大概率用到DFS（深度优先遍历） -> 树形思维方式 -> 递归式和递归边界 -> 对“坑位”的定位和分析
 *
 * “坑位”对应的就是树形逻辑中树的某一层，“坑位数”往往意味着递归边界的限制条件。
 *
 * 找“坑位”的思路规律：
 * “坑位”往往是那些不会变化的东西。题目1中，排列的顺序是变化的，而每个排列中数字的个数却是不变的，因此数字的个数就对应“坑位”的个数；
 * 本题中，每个组合中数字的个数是不确定的，不变的东西变成了“可以参与组合的数字”，变化的东西则是每个数字在组合中的“存在性”。
 *
 * 因此思路为：“从每一个数字入手，讨论它出现或者不出现的情况”。
 *
 * 递归式和递归边界：
 * 1、递归式：检查手里剩下的数字有哪些（有没有发现和题目1的递归式是一样的，因为两道题到强调了数字不能重复使用），选取其中一个填进当前的坑里、或者干脆把这个坑空出来（此处就体现了和题目1的区别，本题强调的是存在性而非顺序）。
 * 2、递归边界：组合里数字个数的最大值。拿示例来说，指给了3个数，因此组合里数字最多也只有3个，超过了3个则视为触碰递归边界。
 * 编码复盘：
 * 1、递归式的变化：在上一道题中，我们检查一个数字是否可用的依据是它是否已被纳入当前排列（ visited 值是否为 1），而这道题中，并不存在一个类似 visited 一样的标记对象。取而代之的，是每次直接以 index 作为了索引起点。这是因为，在排列场景下，一个元素可能出现在任何坑位里；而在组合场景下，坑位的选择逻辑发生了变化，坑位和元素是一一对应的。因此讨论完一个坑位的取舍后，一个元素的取舍也相应地讨论完毕了，直接跳过这个元素的索引往下走即可。
   2、递归边界的变化：这道题中，并没有显式的 return 语句来标示递归边界的存在。这个边界的判定被 for 语句偷偷地做掉了： for 语句会遍历所有的数字，当数字遍历完全时，也就意味着递归走到了尽头。
 *
*/

const subsets = function (nums) {
  // 初始化结果数组
  const res = []
  // 缓存数组长度
  const len = nums.length
  // 初始化组合数组
  const subset = []
  // 进入dfs（深度遍历）
  dfs(0)
  // 定义 dfs 函数， 入参是 nums 中的数字索引
  function dfs (index) {
    // 每次进入，都意味着组合内容更新了一次，故直接推入结果数组
    res.push(subset.slice())
    // 从当前数字的索引开始， 遍历nums
    for (let i = index; i < len; i++) {
      // 这是当前数字存在于组合中的情况
      subset.push(nums[i])
      // 基于当前数字存在于组合中的情况，进一步dfs
      dfs(i + 1)
      // 这是当前数字不存在与组合中的情况
      subset.pop()
    }
  }
  // 返回结果数组
  return res
}
console.log(subsets([1, 2, 3]))



// ***** 限定组合问题：及时回溯，即为“剪枝”

/**
 * 题目3：
 * 给定两个整数 n 和 k，返回 1...n 中所有可能的 k 个数的组合。
 *
 * 示例：
 * 输入：n = 4， k = 2
 * 输出：[
 *  [2,4],
 *  [3,4],
 *  [2,3],
 *  [1,2],
 *  [1,3],
 *  [1,4],
 * ]
 *
 * 解法（思路分析）：
 * 这是一道复杂的组合问题，它追加了一个限定条件 ---- 只返回 n 个数中 k 个数的组合。
 *
 * 在深度优先搜索中，有时我们会去掉一些不符合题目要求的、没有作用的答案，进而得到正确答案。这个丢掉答案的过程，形似减掉树的枝叶，所以这一方法被称为“剪枝”。
 *
 *
 * 剪枝，需要分别在组合问题的递归式和递归边界上动手脚
 * 1、递归式：普通组合问题，每到一个新的坑位处，我们都需要对组合结果数组进行更新；这题中，当且仅当组合内的数字个数为 k 个时，才会对组合结果数组进行更新。
 * 2、递归边界：只要组合内数组个数达到了 k 个， 就不再继续当前的路径往下遍历，而是直接返回。
 *
 *
 * 何为“回溯”？
 * 回溯算法实际上一个类似枚举的搜索尝试过程，主要是在搜索尝试过程中寻找问题的解，当发现条件不满足求解条件时，就“回溯”返回，尝试别的路径。
 * 回溯算法是一种选优搜索法，按选优条件向前搜索，已达到目标。但当搜索到某一步时，发现原先选择并不优或达不到目标，就退回一步重新选择，這种走不通就退回在走的技术为回溯法，而满足回溯条件的某个状态的点成为“回溯点”。
 * 许多复杂的，规模较大的问题都可以使用回溯法，有“通用解题方法”的美称。
 * 回溯算法的基本思想是：从一条路往前走，能进则进，不能进则退回来，换一条路再试。 ---- LeetCode
 *
 *
 *
*/


const combine = function (n, k) {
  // 初始化结果数组
  const res = []
  // 初始化组合数据
  const subset = []

  // 进入dfs，起始数字是 1
  dfs(1)

  // 定义 dfs 函数， 入参是当前遍历到的数字
  function dfs (index) {
    if (subset.length === k) {
      res.push(subset.clice())
      return
    }
    // 从当前数字的值开始， 遍历index - n 之间的所有数字
    for (let i = index; i < n; i++) {
      // 这是当前数字存在于组合中的情况
      subset.push(i)
      // 基于当前数字存在于组合中的情况， 进一步dfs
      dfs(i + 1)
      // 这是当前数字不存在与组合中的情况
      subset.pop()
    }
  }

  // 返回结果数组
  return res
}

// 不问解的内容，只问解的个数。这类问题往往不用 DFS 来解，而是用动态规划。

// ***** 递归与回溯问题 ---- 解题模板总结

/**
 * 搞清三个问题：
 * 1、什么时候用？（明确场景）
 *  看两个特征：
 *  a、题中暗示了一个或多个解，并且要求我们详尽地列举出每一个解的内容时，一定要想到DFS、想到递归回溯。
 *  b、题目经分析后，可以转化为树形逻辑模型求解。
 *
 * 2、为什么这样用？（提供依据）
 *  递归与回溯的过程，本身就是穷举的过程。题中要求列举每一个解的内容，解从哪来？解是基于穷举思想、对搜索树进行恰当地剪枝后得来的。
 *
 * 3、怎么用？（细化步骤）
 *  一个模型 -- 树形逻辑模型；
 *  两个要点 -- 递归式和递归边界。
 *
 * 树形逻辑模型的构建，关键在于找“坑位”，一个坑位就对应书中的一层，每一层的处理逻辑往往是一样的，这个逻辑就是递归式的内容。至于递归边界，要么在题中约束得非常清楚、要么默认为“坑位”数量的边界。
*/

// 伪代码：用伪代码总结一下编码形式，大部分的题解都符合以下特征：
// function xxx (入参) {
//   前期的变量定义、缓存等准备工作

//   // 定义路径栈
//   const path = []

//   // 进入 dfs
//   dfs(起点)

//   // 定义 dfs
//   dfs(递归参数) {
//     if (到达了递归边界) {
//       结合题意处理边界逻辑，往往和 path 内容有关
//       return
//     }

//     // 注意这里也可能不是 for，视题意决定
//     for (遍历坑位的可选值) {
//       path.push(当前选中值)
//       处理坑位本身的相关逻辑
//       path.pop()
//     }
//   }
// }
