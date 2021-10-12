/**
 * 基础排序算法：
 *  1、冒泡排序
 *  2、插入排序
 *  3、选择排序
 *
 * 基础排序算法，普遍复合两个特征：
 *  a、易于理解，上手迅速
 *  b、时间效率差
 *
 * 进阶排序算法
 *  1、归并排序
 *  2、快速排序
 *
 *
*/


/**
 * 1、冒泡排序
 *
 * 基本思路分析：
 *  冒泡排序的过程，就是从第一个元素开始，重复比较相邻的两个项，若第一项比第二项更大，则交换两者的位置；反之不动。
 *
 * 冒泡排序的时间复杂度:
 *  1、最好时间复杂度：它对应的是数组本身有序这种情况。在这种情况下，我们只需要作比较（n-1 次），而不需要做交换。时间复杂度为 O(n)
 *  2、最坏时间复杂度： 它对应的是数组完全逆序这种情况。在这种情况下，每一轮内层循环都要执行，重复的总次数是 n(n-1)/2 次，因此时间复杂度是 O(n^2)
 *  3、平均时间复杂度：这个东西比较难搞，它涉及到一些概率论的知识。实际面试的时候也不会有面试官摁着你让你算这个，这里记住平均时间复杂度是 O(n^2) 即可。
 *
 * 时间复杂度：O(n^2)
 * 最优可能下时间复杂度：O(n)
*/

function betterBubbleSort (arr) {
  const len = arr.length

  for (let i = 0; i < len; i++) {
    // 添加一个标志位
    let flag = false

    for (let j = 0; i < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        // 只要发生了一次交换，就修改标志位
        flag = true
      }
    }
    // 若一次交换也没发生，则说明数组有序，直接放过
    // 此处将在最好情况下的时间复杂度优化为O(n)
    if (flag === false) return arr
  }
  return arr
}


/**
 * 2、选择排序
 *
 * 思路分析：
 * 选择排序的关键字是：‘最小值’：
 *    循环遍历数组，每次都找出当前范围内的最小值，把它放在当前范围的头部；然后缩小排序范围，继续重复以上操作，直至数组完全有序为止。
 *
 *
 * 时间复杂度： O(n^2)
 * 最好情况也好，最坏情况也罢，两者之间的区别仅仅在于元素交换的次数不同，但都是要走内层循环作比较的。因此选择排序的三个时间复杂度都对应两层循环消耗的时间量级： O(n^2)。
 *
 *
*/

function selectSort (arr) {
  // 缓存数组长度
  const len = arr.length
  // 定义 minIndex ，缓存当前区间最小值的索引
  let minIndex
  // i 是当前排序区间的起点
  for (let i = 0; i < len - 1; i++) {
    // 初始化 minIndex 为当前区间第一个元素
    minIndex = i
    // i、j 分别定义当前区间的上下界，i 是左边界，j 是右边界
    for (let j = i; j < len; j++) {
      // 若 j 处的数据项比当前最小值还要小，则更新最小值索引为 j
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    // 如果 minIndex 对应元素不是目前的头部元素，则交换两者
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }
  }
  return arr
}


/**
 * 3、插入排序
 *
 * 插入排序的核心思想是“找到元素在它前面那个序列中的正确位置”。
 * 插入排序所有操作都基于一个这样的前提：当前元素前面的序列是有序的。基于这个前提，从后往前去寻找当前元素在前面那个序列里的正确位置。
 *
 * 通过正确的定位当前元素在有序序列里的位置、不断扩大有序数组的范围，最终达到完全排序的目的。
 *
 *
 * 关键点：
 *  1、当前元素前面的那个序列是有序的
 *  2、“正确的位置”如何定义 -- 所有在当前元素前面的数都不大于它，所有在当前元素后面的数都不小于它
 *  3、在有序序列里定位元素位置的时候，是从后往前定位的。只要发现一个比当前元素大的值，就需要为当前元素腾出一个新的坑位。
 *
 * 插入排序的时间复杂度：
 *  1、最好时间复杂度： 它对应的数组本身就是有序這种情况。此时内层循环只走一次，整体复杂度取决于外层循环，时间复杂度就是一层循环对应的 O(n)。
 *  2、最坏时间复杂度： 它对应的数组完全逆序這种情况。此时内层循环每次都要移动有序序列里的所有元素，因此时间复杂度对应的就是两层循环的 O(n^2)。
 *  3、平均时间复杂度：O(n^2)。
*/

function insertSort (arr) {
  // 缓存数组长度
  const len = arr.length
  // temp 用来保存当前需要插入的元素
  let temp
  // i 用于标识每次被插入的元素的索引
  for (let i = 0; i < len; i++) {
    // j 用于帮助 temp 寻找自己应该有的定位
    let j = i
    temp = arr[i]
    // 判断 j 前面一个元素是否比 temp 大
    while (j > 0 && arr[j - 1] > temp) {
      // 如果是， 则将 j 前面的一个元素后移一位， 为 temp 让出位置
      arr[j] = arr[j - 1]
      j--
    }
    // 循环让位， 最后得到的 j 就是 temp 的正确索引
    arr[j] = temp
  }
  return arr
}