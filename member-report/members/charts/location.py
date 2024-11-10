import seaborn as sns
from matplotlib.axes import Axes

from members.member import Member


def plot_country_distribution(ax: Axes, members: list[Member]):
    countries = [member.country for member in members]
    sns.countplot(y=countries, edgecolor='skyblue', color='skyblue', ax=ax)
    ax.set_title('Country Distribution of Members')
    ax.set_xlabel('Number of Members')
    ax.set_ylabel('Country')
    ax.grid(axis='x', linestyle='--', alpha=0.7)
    ax.invert_yaxis()
    ax.bar_label(ax.containers[0]);    