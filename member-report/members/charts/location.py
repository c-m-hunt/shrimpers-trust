
import pandas as pd
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
    ax.bar_label(ax.containers[0])

def plot_southend_postcode_distribution(ax: Axes, members: list[Member]):
    df_members = pd.DataFrame.from_records([m.__dict__ for m in members])
    df_members["postcode_part"] = df_members["postcode"].str.split(" ").str[0]
    postcodes = df_members[df_members["postcode_part"].str.startswith("SS")].sort_values("postcode_part")
    sns.histplot(postcodes, x="postcode_part", edgecolor='skyblue', color='skyblue', multiple="stack", hue="gender", ax=ax)
    ax.set_title('Postcode Distribution of Southend-on-Sea Members')
    ax.set_ylabel('Number of Members')
    ax.set_xlabel('Postcode')
    ax.grid(axis='x', linestyle='--', alpha=0.7)
    ax.tick_params(axis='x', labelrotation=90)

def plot_southend_postcode_average_age(ax: Axes, members: list[Member]):
    df_members = pd.DataFrame.from_records([m.__dict__ for m in members])
    df_members["postcode_part"] = df_members["postcode"].str.split(" ").str[0]
    postcodes = df_members[df_members["postcode_part"].str.startswith("SS")].sort_values("postcode_part")
    sns.barplot(data=postcodes, x="postcode_part", y="age", errorbar=None, ax=ax)
    ax.set_title('Average Age of Southend-on-Sea Members by Postcode')
    ax.set_ylabel('Average Age')
    ax.set_xlabel('Postcode')
    ax.grid(axis='y', linestyle='--', alpha=0.7)
    ax.tick_params(axis='x', labelrotation=90)
    ax.bar_label(ax.containers[0], fmt="{0:.1f}", fontsize=10)