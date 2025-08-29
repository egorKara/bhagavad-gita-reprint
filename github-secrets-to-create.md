# GitHub Secrets для создания

## Автоматически обнаруженные секреты

**ВНИМАНИЕ:** Эти секреты были обнаружены в коде и должны быть перемещены в GitHub Secrets!

### Список секретов для создания:

1. **SECRET_1** = `password = admin123`
2. **SECRET_2** = `Password: password12...`
3. **SECRET_3** = `Password: process.en...`
4. **SECRET_4** = `Password=your_passwo...`
5. **SECRET_5** = `eyJhbGciOiJIUzI1NiIs...`
6. **SECRET_6** = `PASSWORD=password`
7. **SECRET_7** = `postgresql://user:pa...`
8. **SECRET_8** = `postgresql://postgre...`
9. **SECRET_9** = `8319867749:AAFOq66KN...`
10. **SECRET_10** = `9euelZqdyI7Mi5OJmZeQ...`
11. **SECRET_11** = `d3z9w5YOzr57yRwZBr9z...`
12. **SECRET_12** = `oi3crg5mF52x9loJeFub...`
13. **SECRET_13** = `8319867749:AAEDKiPXk...`
14. **SECRET_14** = `oi3crg5mF52x9loJeFub...`
15. **SECRET_15** = `Password=postgres;Po...`
16. **SECRET_16** = `PASSWORD=
REDIS_DB=0`
17. **SECRET_17** = `PASSWORD=your-app-pa...`
18. **SECRET_18** = `PASSWORD=admin`
19. **SECRET_19** = `password: ${{`
20. **SECRET_20** = `postgresql://dev_use...`
21. **SECRET_21** = `postgresql://staging...`
22. **SECRET_22** = `postgresql://prod_us...`
23. **SECRET_23** = `password: \`
24. **SECRET_24** = `PASSWORD: gita_passw...`
25. **SECRET_25** = `Password:**`
26. **SECRET_26** = `forceConsistentCasin...`
27. **SECRET_27** = `Password: password12...`
28. **SECRET_28** = `Password: process.en...`
29. **SECRET_29** = `Password=your_passwo...`
30. **SECRET_30** = `AKIA1234567890ABCDEF`
31. **SECRET_31** = `lQKvtaTDOXnoVJ20ibTu...`
32. **SECRET_32** = `2ZnRENj0cktKZhtchBMt...`
33. **SECRET_33** = `1rze9MT1yfWqSIbUPGRu...`
34. **SECRET_34** = `analysislevelmicroso...`
35. **SECRET_35** = `noSwS8bZCKcHz0ydkTDQ...`
36. **SECRET_36** = `QoMMcw4f3Tirf8PzgdDa...`
37. **SECRET_37** = `fFKkr24cYc7Zw5T6DC4t...`
38. **SECRET_38** = `3KuSxeHoNYdxVYfg2IRZ...`
39. **SECRET_39** = `iLSutpgX1CC0NOW70FJo...`
40. **SECRET_40** = `ecbdf3NQm6xCl3zMbaP4...`
41. **SECRET_41** = `W5hMoPjLkRFnXzH44zDL...`
42. **SECRET_42** = `VMoJjBS1QvsxqJeqLaJX...`
43. **SECRET_43** = `5YmJBNn379tJPIK04FOv...`
44. **SECRET_44** = `ICPoJG6pxuKFsumtZp89...`
45. **SECRET_45** = `bedc5d6b3e782a5e50d3...`
46. **SECRET_46** = `password = \`
47. **SECRET_47** = `Password: \`
48. **SECRET_48** = `postgresql://user:pa...`
49. **SECRET_49** = `postgresql://dev_use...`
50. **SECRET_50** = `postgresql://staging...`
51. **SECRET_51** = `ghp_abcdef1234567890...`
52. **SECRET_52** = `metricsz2YandexMonit...`
53. **SECRET_53** = `metricsz7YandexMonit...`
54. **SECRET_54** = `metricsz4YandexMonit...`
55. **SECRET_55** = `yandexz2YandexMonito...`
56. **SECRET_56** = `collectionz2YandexMo...`
57. **SECRET_57** = `1234567890abcdef1234...`
58. **SECRET_58** = `abcdef1234567890abcd...`
59. **SECRET_59** = `abcdefghijklmnopqrst...`
60. **SECRET_60** = `password: super_secr...`

### Инструкции по созданию:

1. Перейдите в ваш GitHub репозиторий
2. Нажмите Settings → Secrets and variables → Actions
3. Создайте новые repository secrets с именами SECRET_1, SECRET_2, etc.
4. Замените в коде все найденные секреты на переменные окружения
5. Используйте в GitHub Actions: `${{ secrets.SECRET_1 }}`

### Пример замены в коде:

```javascript
// БЫЛО (НЕБЕЗОПАСНО):
const apiKey = "sk-1234567890abcdef";

// СТАЛО (БЕЗОПАСНО):
const apiKey = process.env.API_KEY;
```

**Дата обнаружения:** 29.08.2025, 08:45:46
**Агент безопасности:** Cursor Security Agent v1.0
